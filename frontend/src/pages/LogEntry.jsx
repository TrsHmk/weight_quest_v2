import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Scale, Footprints, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { rollArtifact, rollChest, RARITY_CONFIG } from "@/lib/artifacts";
import {
  calculateWeightXP, calculateStepsXP, calculateStepsMoney,
  calculateStreakXP, getPenaltyZone, getLevelForXP,
  getUnlockedMilestones, MILESTONES,
} from "@/lib/gameConfig";

export default function LogEntry() {
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 60),
  });

  const profile = profiles[0];
  const todayLog = logs.find(l => l.date === todayStr);

  const logMutation = useMutation({
    mutationFn: async () => {
      const w = parseFloat(weight);
      const s = parseInt(steps) || 0;
      
      const prevWeight = profile?.current_weight || 96;
      const lowestWeight = Math.min(profile?.lowest_weight || 96, w);
      const currentStreak = (profile?.current_streak || 0) + 1;
      const bestStreak = Math.max(profile?.best_streak || 0, currentStreak);

      // Calculate XP
      const weightXP = calculateWeightXP(prevWeight, w);
      const stepsXP = calculateStepsXP(s);
      const streakXP = calculateStreakXP(currentStreak);
      const totalDayXP = weightXP + stepsXP + streakXP;
      const newTotalXP = (profile?.total_xp || 0) + totalDayXP;

      // Money
      const dayMoney = calculateStepsMoney(s);
      const totalMoney = (profile?.total_money_saved || 0) + dayMoney;

      // Penalty zone
      const penaltyZone = getPenaltyZone(w, lowestWeight);

      // Milestones
      const newMilestones = getUnlockedMilestones(w).map(m => m.index);
      const prevMilestones = profile?.unlocked_milestones || [];
      const allMilestones = [...new Set([...prevMilestones, ...newMilestones])];

      // Freeze privileges if penalty
      let frozenPrivileges = profile?.frozen_privileges || [];
      if (penaltyZone === "red") {
        const freezeUntil = new Date();
        freezeUntil.setDate(freezeUntil.getDate() + 5);
        frozenPrivileges = allMilestones.map(mi => ({
          milestone_index: mi,
          frozen_until: format(freezeUntil, "yyyy-MM-dd"),
        }));
      }

      // Events
      const events = [];
      if (weightXP > 0) events.push(`🎉 Скинув ${(prevWeight - w).toFixed(1)} кг (+${weightXP} XP)`);
      if (stepsXP > 0) events.push(`👟 ${s.toLocaleString()} кроків (+${stepsXP} XP)`);
      if (streakXP > 0) events.push(`🔥 Тижневий стрік бонус! (+${streakXP} XP)`);
      if (dayMoney > 0) events.push(`💰 Заощаджено ${dayMoney} ₴`);
      newMilestones.filter(mi => !prevMilestones.includes(mi)).forEach(mi => {
        events.push(`🏆 Новий мілстоун: ${MILESTONES[mi].label}!`);
      });
      if (penaltyZone === "yellow") events.push("⚠️ Жовта зона — обережно!");
      if (penaltyZone === "red") events.push("🚨 Червона зона — привілеї заморожено на 5 днів!");

      // Create daily log
      await base44.entities.DailyLog.create({
        date: todayStr,
        weight: w,
        steps: s,
        xp_earned: totalDayXP,
        money_saved: dayMoney,
        events,
        streak_day: currentStreak,
        penalty_zone: penaltyZone,
      });

      // Update or create profile
      const level = getLevelForXP(newTotalXP);
      const profileData = {
        total_xp: newTotalXP,
        current_level: level.level,
        current_streak: currentStreak,
        best_streak: bestStreak,
        current_weight: w,
        lowest_weight: lowestWeight,
        start_weight: profile?.start_weight || 96,
        total_money_saved: totalMoney,
        total_steps: (profile?.total_steps || 0) + s,
        unlocked_milestones: allMilestones,
        unlocked_achievements: profile?.unlocked_achievements || [],
        frozen_privileges: frozenPrivileges,
        penalty_zone: penaltyZone,
      };

      if (profile?.id) {
        await base44.entities.PlayerProfile.update(profile.id, profileData);
      } else {
        await base44.entities.PlayerProfile.create(profileData);
      }

      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });

      return { totalDayXP, events };
    },
    onSuccess: (data) => {
      toast.success(`День записано! +${data.totalDayXP} XP ⚔️`, { duration: 2000 });

      // Roll for artifact drop
      const artifact = rollArtifact();
      if (artifact) {
        const cfg = RARITY_CONFIG[artifact.rarity];
        setTimeout(() => {
          toast(`${artifact.icon} Артефакт випав!`, {
            description: `[${cfg.label}] ${artifact.name} — ${artifact.effect}`,
            duration: 5000,
          });
        }, 600);
        base44.api.post('/inventory', { artifact_id: artifact.id }).catch(() => {});
      }

      // Roll for chest drop
      const chest = rollChest();
      if (chest) {
        setTimeout(() => {
          toast(`${chest.icon} Скриня випала!`, {
            description: `[${RARITY_CONFIG[chest.rarity].label}] ${chest.name} — відкрий в інвентарі!`,
            duration: 5000,
          });
        }, 1200);
        base44.api.post('/inventory', { artifact_id: chest.id }).catch(() => {});
      }

      setWeight("");
      setSteps("");
      setTimeout(() => navigate("/"), 1500);
    },
  });

  if (todayLog) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-card border border-primary/20 p-8 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-pixel text-sm text-accent mb-2">ДЕНЬ ЗАПИСАНИЙ!</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {todayLog.weight} кг • {(todayLog.steps || 0).toLocaleString()} кроків
          </p>
          <div className="space-y-1">
            {todayLog.events?.map((e, i) => (
              <p key={i} className="text-xs text-muted-foreground">{e}</p>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Повертайся завтра, воїне! ⚔️</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6 md:p-8"
      >
        <h2 className="font-pixel text-sm text-accent mb-1">⚔️ ЩОДЕННИЙ ЗАПИС</h2>
        <p className="text-xs text-muted-foreground mb-8">{format(new Date(), "EEEE, d MMMM yyyy")}</p>

        <div className="space-y-6">
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Scale className="w-4 h-4 text-primary" />
              Вага (кг)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Наприклад: 93.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-secondary border-border text-lg h-12"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Footprints className="w-4 h-4 text-primary" />
              Кроки
            </Label>
            <Input
              type="number"
              placeholder="Наприклад: 8500"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="bg-secondary border-border text-lg h-12"
            />
          </div>

          {/* Preview XP */}
          {weight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-1"
            >
              <p className="font-pixel text-[8px] text-accent mb-2">ПОПЕРЕДНІЙ ПЕРЕГЛЯД</p>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Вага XP:</span>
                <span className="font-bold">{calculateWeightXP(profile?.current_weight || 96, parseFloat(weight))}</span>
              </div>
              {steps && (
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Кроки XP:</span>
                  <span className="font-bold">{calculateStepsXP(parseInt(steps) || 0)}</span>
                </div>
              )}
            </motion.div>
          )}

          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-purple"
            onClick={() => logMutation.mutate()}
            disabled={!weight || logMutation.isPending}
          >
            {logMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Записати день
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}