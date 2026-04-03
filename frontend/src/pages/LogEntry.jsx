import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Scale, Footprints, Zap, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { rollArtifact, rollChest, RARITY_CONFIG, getChest } from "@/lib/artifacts";
import {
  calculateWeightXP, calculateStepsXP, calculateStepsMoney,
  calculateStreakXP, getPenaltyZone, getLevelForXP,
  getUnlockedMilestones, MILESTONES,
} from "@/lib/gameConfig";

export default function LogEntry() {
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [stepsUpdate, setStepsUpdate] = useState("");
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
      let w = parseFloat(weight);
      const s = parseInt(steps) || 0;

      const prevWeight = profile?.current_weight ?? w;
      const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
      const lastLog = logs[0]; // sorted desc, most recent

      // Active effects from profile
      let activeEffects = [...(profile?.active_effects || [])];
      const consumedEffects = new Set();
      const events = [];

      // ── Streak calculation with auto-reset + streak_shield ──
      let currentStreak;
      if (!lastLog || lastLog.date === yesterday) {
        currentStreak = (profile?.current_streak || 0) + 1;
      } else {
        // Missed one or more days
        const shieldIdx = activeEffects.findIndex(e => e.type === 'streak_shield');
        if (shieldIdx >= 0) {
          currentStreak = profile.current_streak; // preserve streak
          consumedEffects.add(shieldIdx);
          events.push(`🛡️ Захист стріку спрацював! Стрік збережено (${currentStreak} днів)`);
        } else {
          currentStreak = 1;
          events.push(`💔 Стрік скинуто. Новий початок!`);
        }
      }
      const bestStreak = Math.max(profile?.best_streak || 0, currentStreak);

      // ── Apply weight_reduce effect ──
      const weightReduceIdx = activeEffects.findIndex(e => e.type === 'weight_reduce');
      if (weightReduceIdx >= 0) {
        const reduceBy = activeEffects[weightReduceIdx].value || 0.5;
        w = Math.max(0, w - reduceBy);
        consumedEffects.add(weightReduceIdx);
        events.push(`⚖️ Щасливі ваги: -${reduceBy} кг до запису!`);
      }

      const lowestWeight = Math.min(profile?.lowest_weight ?? w, w);

      // ── Calculate XP ──
      const weightXP = calculateWeightXP(prevWeight, w);
      const stepsXP = calculateStepsXP(s);
      const streakXP = calculateStreakXP(currentStreak);
      let totalDayXP = weightXP + stepsXP + streakXP;

      // ── Apply xp_multiplier effect ──
      const multiplierIdx = activeEffects.findIndex(e => e.type === 'xp_multiplier');
      if (multiplierIdx >= 0) {
        const mult = activeEffects[multiplierIdx].value || 2;
        totalDayXP = Math.round(totalDayXP * mult);
        consumedEffects.add(multiplierIdx);
        events.push(`✨ Множник XP x${mult} активовано! (+${totalDayXP} XP)`);
      }

      const newTotalXP = (profile?.total_xp || 0) + totalDayXP;

      // ── Money ──
      const dayMoney = calculateStepsMoney(s);
      const totalMoney = (profile?.total_money_saved || 0) + dayMoney;

      // ── Penalty zone ──
      let penaltyZone = getPenaltyZone(w, lowestWeight);

      // ── Apply penalty_immunity effect ──
      const immunityIdx = activeEffects.findIndex(e => e.type === 'penalty_immunity');
      if (immunityIdx >= 0 && penaltyZone !== 'none') {
        penaltyZone = 'none';
        consumedEffects.add(immunityIdx);
        events.push(`🛡️ Імунітет штрафів активовано! Зона ігнорується.`);
      }

      // ── Remove consumed effects ──
      activeEffects = activeEffects.filter((_, idx) => !consumedEffects.has(idx));

      // ── Milestones ──
      const newMilestones = getUnlockedMilestones(w).map(m => m.target);
      const prevMilestones = profile?.unlocked_milestones || [];
      const allMilestones = [...new Set([...prevMilestones, ...newMilestones])];

      // ── Freeze privileges if penalty ──
      let frozenPrivileges = profile?.frozen_privileges || [];
      if (penaltyZone === "red") {
        const freezeUntil = new Date();
        freezeUntil.setDate(freezeUntil.getDate() + 5);
        frozenPrivileges = allMilestones.map(mi => ({
          milestone_index: mi,
          frozen_until: format(freezeUntil, "yyyy-MM-dd"),
        }));
      }

      if (weightXP > 0) events.push(`🎉 Скинув ${(prevWeight - w).toFixed(1)} кг (+${weightXP} XP)`);
      if (stepsXP > 0) events.push(`👟 ${s.toLocaleString()} кроків (+${stepsXP} XP)`);
      if (streakXP > 0) events.push(`🔥 Тижневий стрік бонус! (+${streakXP} XP)`);
      if (dayMoney > 0) events.push(`💰 Заощаджено ${dayMoney} ₴`);
      newMilestones.filter(mi => !prevMilestones.includes(mi)).forEach(mi => {
        const ms = MILESTONES.find(m => m.target === mi);
        if (ms) events.push(`🏆 Новий мілстоун: ${ms.label}!`);
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
        start_weight: profile?.start_weight,
        goal_weight: profile?.goal_weight,
        total_money_saved: totalMoney,
        total_steps: (profile?.total_steps || 0) + s,
        unlocked_milestones: allMilestones,
        unlocked_achievements: profile?.unlocked_achievements || [],
        frozen_privileges: frozenPrivileges,
        penalty_zone: penaltyZone,
        active_effects: activeEffects,
      };

      if (profile?.id) {
        await base44.entities.PlayerProfile.update(profile.id, profileData);
      } else {
        await base44.entities.PlayerProfile.create(profileData);
      }

      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });

      return { totalDayXP, events, currentStreak, penaltyZone, steps: parseInt(steps) || 0, weight: parseFloat(weight), prevWeight: profile?.current_weight || null };
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

      // Check quest completion
      base44.api.post('/quests/complete', {
        steps: data.steps,
        weight: data.weight,
        prevWeight: data.prevWeight,
        streak: data.currentStreak,
        penaltyZone: data.penaltyZone,
      }).then(({ completed }) => {
        completed.forEach((q, idx) => {
          const chest = getChest(q.chest);
          setTimeout(() => {
            toast(`${q.icon} Квест виконано: ${q.name}!`, {
              description: `Нагорода: ${chest?.icon || ''} ${chest?.name || q.chest} додано до інвентаря`,
              duration: 5000,
            });
          }, 2000 + idx * 600);
        });
      }).catch(() => {});

      setWeight("");
      setSteps("");
      setTimeout(() => navigate("/"), 1500);
    },
  });

  const updateStepsMutation = useMutation({
    mutationFn: async () => {
      const newSteps = parseInt(stepsUpdate) || 0;
      const oldSteps = todayLog?.steps || 0;

      const oldStepsXP  = calculateStepsXP(oldSteps);
      const newStepsXP  = calculateStepsXP(newSteps);
      const deltaXP     = newStepsXP - oldStepsXP;
      const oldMoney    = calculateStepsMoney(oldSteps);
      const newMoney    = calculateStepsMoney(newSteps);
      const deltaMoney  = newMoney - oldMoney;

      // Rebuild events: drop old step event, add new one
      const baseEvents = (todayLog?.events || []).filter(e => !e.includes('кроків'));
      const newEvents  = [...baseEvents];
      if (newStepsXP > 0) newEvents.push(`👟 ${newSteps.toLocaleString()} кроків (+${newStepsXP} XP)`);
      if (deltaMoney > 0) {
        // remove old money event if steps changed it
        const moneyIdx = newEvents.findIndex(e => e.includes('Заощаджено'));
        const totalMoney = newMoney;
        if (moneyIdx >= 0) newEvents[moneyIdx] = `💰 Заощаджено ${totalMoney} ₴`;
        else if (totalMoney > 0) newEvents.push(`💰 Заощаджено ${totalMoney} ₴`);
      }

      await base44.entities.DailyLog.update(todayLog.id, {
        steps: newSteps,
        xp_earned: (todayLog.xp_earned || 0) + deltaXP,
        money_saved: (todayLog.money_saved || 0) + deltaMoney,
        events: newEvents,
      });

      if (profile?.id) {
        await base44.entities.PlayerProfile.update(profile.id, {
          total_xp: (profile.total_xp || 0) + deltaXP,
          total_steps: (profile.total_steps || 0) + (newSteps - oldSteps),
          total_money_saved: (profile.total_money_saved || 0) + deltaMoney,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
      return { deltaXP, newSteps };
    },
    onSuccess: ({ deltaXP, newSteps }) => {
      const msg = deltaXP > 0 ? `Кроки оновлено! +${deltaXP} XP 👟` : `Кроки оновлено: ${newSteps.toLocaleString()} 👟`;
      toast.success(msg, { duration: 2500 });
      setStepsUpdate("");
    },
  });

  if (todayLog) {
    const canUpdateSteps = parseInt(stepsUpdate) > 0 && parseInt(stepsUpdate) !== (todayLog.steps || 0);
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto space-y-4">
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

        {/* Evening steps update */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border p-6"
        >
          <h3 className="font-pixel text-[10px] text-accent mb-4">👟 ВЕЧІРНІ КРОКИ</h3>
          <div className="space-y-3">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Footprints className="w-4 h-4 text-primary" />
                Кроки за сьогодні
              </Label>
              <Input
                type="number"
                placeholder={`Зараз: ${(todayLog.steps || 0).toLocaleString()}`}
                value={stepsUpdate}
                onChange={e => setStepsUpdate(e.target.value)}
                className="bg-secondary border-border text-lg h-12"
              />
            </div>
            {stepsUpdate && !isNaN(parseInt(stepsUpdate)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl bg-primary/5 border border-primary/20 p-3 flex items-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Кроки XP:</span>
                <span className="font-bold">
                  {calculateStepsXP(parseInt(stepsUpdate) || 0)}
                  {todayLog.steps > 0 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (було {calculateStepsXP(todayLog.steps)})
                    </span>
                  )}
                </span>
              </motion.div>
            )}
            <Button
              className="w-full h-11 font-bold"
              variant="outline"
              onClick={() => updateStepsMutation.mutate()}
              disabled={!canUpdateSteps || updateStepsMutation.isPending}
            >
              {updateStepsMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Оновити кроки
                </>
              )}
            </Button>
          </div>
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
                <span className="font-bold">{calculateWeightXP(profile?.current_weight ?? parseFloat(weight), parseFloat(weight))}</span>
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