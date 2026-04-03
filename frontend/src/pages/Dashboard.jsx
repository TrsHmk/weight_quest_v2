import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PlayerCard from "@/components/dashboard/PlayerCard";
import QuickStats from "@/components/dashboard/QuickStats";
import WeightChart from "@/components/dashboard/WeightChart";
import MilestoneTracker from "@/components/dashboard/MilestoneTracker";
import StepGoals from "@/components/dashboard/StepGoals";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Target, Shield, Gift, Dumbbell, Check } from "lucide-react";
import { getLevelForXP, getNextLevel } from "@/lib/gameConfig";
import { toast } from "sonner";

function GoalProgress({ profile }) {
  const start = profile.start_weight || 96;
  const goal = profile.goal_weight;
  const current = profile.current_weight || start;
  if (!goal || goal >= start) return null;

  const totalToLose = start - goal;
  const lost = Math.max(0, start - current);
  const progress = Math.min((lost / totalToLose) * 100, 100);
  const remaining = Math.max(0, current - goal).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-accent" />
        <span className="font-pixel text-[10px] text-accent uppercase tracking-widest">Ціль по вазі</span>
        <span className="ml-auto text-xs text-muted-foreground">{current.toFixed(1)} → {goal} кг</span>
      </div>
      <Progress
        value={progress}
        className="h-3 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-accent"
      />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{lost.toFixed(1)} кг скинуто</span>
        <span className={remaining === "0.0" ? "text-green-400 font-bold" : ""}>
          {remaining === "0.0" ? "🏆 Ціль досягнута!" : `Залишилось ${remaining} кг`}
        </span>
      </div>
    </motion.div>
  );
}

function LiveMessage({ profile, todayLog, prevLog }) {
  const streak = profile.current_streak || 0;
  const level = getLevelForXP(profile.total_xp || 0);
  const nextLevel = getNextLevel(level.level);
  const xpToNext = nextLevel ? nextLevel.xpRequired - (profile.total_xp || 0) : null;
  const activeEffects = profile.active_effects || [];

  const weightDropped = todayLog && prevLog && parseFloat(todayLog.weight) < parseFloat(prevLog.weight);

  const messages = [];

  if (!todayLog) {
    messages.push({ icon: "⚔️", text: "Ще не записав сьогодні. Воїне, вага чекає!" });
  } else if (todayLog.penalty_zone === "red") {
    messages.push({ icon: "🚨", text: "Червона зона! Стережись — привілеї заморожено." });
  } else if (todayLog.penalty_zone === "yellow") {
    messages.push({ icon: "⚠️", text: "Жовта зона. Тримайся — ти ще можеш повернутись!" });
  } else {
    messages.push({ icon: "✅", text: "ооо маладєц, ше не зірвався, жиробас" });
  }

  if (weightDropped) {
    messages.push({ icon: "📉", text: "гуд джоб, не забив цей раз" });
  }

  if (streak >= 30) messages.push({ icon: "👑", text: `${streak} днів підряд! Ти легенда.` });
  else if (streak >= 14) messages.push({ icon: "💪", text: `${streak} днів стріку — майже місяць!` });
  else if (streak >= 7) messages.push({ icon: "🔥", text: `${streak} днів підряд — тиждень сили!` });
  else if (streak >= 3) messages.push({ icon: "🏃", text: `${streak} дні підряд. Не зупиняйся!` });

  if (xpToNext !== null && xpToNext <= 100) {
    messages.push({ icon: "⚡", text: `До наступного рівня лише ${xpToNext} XP!` });
  }

  if (activeEffects.length > 0) {
    const names = { streak_shield: "🛡️ Захист стріку", penalty_immunity: "🛡️ Імунітет штрафів", xp_multiplier: "✨ Множник XP", weight_reduce: "⚖️ Щасливі ваги", legendary_buff: "👑 Легендарний бафф" };
    activeEffects.forEach(e => {
      if (names[e.type]) messages.push({ icon: "🎯", text: `Активний ефект: ${names[e.type]}` });
    });
  }

  if (messages.length === 0) return null;

  return (
    <div className="space-y-2">
      {messages.slice(0, 3).map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2.5 text-sm"
        >
          <span>{msg.icon}</span>
          <span className="text-foreground">{msg.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ActiveChallenges({ profile }) {
  const queryClient = useQueryClient();
  const challenges = profile.challenges || [];
  const pendingRewards = challenges.filter(c => c.type === 'reward' && !c.claimed);
  const pendingChallenges = challenges.filter(c => c.type === 'challenge' && !c.completed);

  const markDone = useMutation({
    mutationFn: async ({ id, field }) => {
      const updated = challenges.map(c =>
        c.id === id ? { ...c, [field]: true } : c
      );
      await base44.entities.PlayerProfile.update(profile.id, { challenges: updated });
    },
    onSuccess: (_, { id, field }) => {
      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
      const ch = challenges.find(c => c.id === id);
      if (field === 'claimed') toast.success(`${ch?.icon || '🎁'} Нагороду отримано!`);
      else toast.success(`${ch?.icon || '✅'} Челендж виконано! Молодець!`);
    },
  });

  if (!pendingRewards.length && !pendingChallenges.length) return null;

  return (
    <div className="space-y-4">
      {/* Pending rewards */}
      {pendingRewards.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card border border-green-500/30 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4 text-green-400" />
            <span className="font-pixel text-[10px] text-green-400 uppercase tracking-widest">
              Заслужені нагороди ({pendingRewards.length})
            </span>
          </div>
          <div className="space-y-2">
            {pendingRewards.map(r => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg bg-green-900/15 border border-green-600/20 px-4 py-3">
                <span className="text-2xl">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <button
                  onClick={() => markDone.mutate({ id: r.id, field: 'claimed' })}
                  disabled={markDone.isPending}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-500/30 text-xs text-green-400 hover:bg-green-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Отримав!
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pending challenges */}
      {pendingChallenges.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl bg-card border border-orange-500/30 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-4 h-4 text-orange-400" />
            <span className="font-pixel text-[10px] text-orange-400 uppercase tracking-widest">
              Активні челенджі ({pendingChallenges.length})
            </span>
          </div>
          <div className="space-y-2">
            {pendingChallenges.map(ch => (
              <div key={ch.id} className="flex items-center gap-3 rounded-lg bg-orange-900/15 border border-orange-600/20 px-4 py-3">
                <span className="text-2xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{ch.title}</p>
                  <p className="text-xs text-muted-foreground">{ch.desc}</p>
                </div>
                <button
                  onClick={() => markDone.mutate({ id: ch.id, field: 'completed' })}
                  disabled={markDone.isPending}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 border border-orange-500/30 text-xs text-orange-400 hover:bg-orange-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Зроблено!
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 60),
  });

  const profile = profiles[0] || {};
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs.find(l => l.date === todayStr);
  const prevLog = logs.find(l => l.date !== todayStr);
  const activeEffects = profile.active_effects || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm md:text-base text-primary">WEIGHT QUEST</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
        </div>
        {!todayLog && (
          <a
            href="/log"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors glow-purple"
          >
            + Записати день
          </a>
        )}
      </div>

      <LiveMessage profile={profile} todayLog={todayLog} prevLog={prevLog} />

      <ActiveChallenges profile={profile} />

      <PlayerCard profile={profile} />
      <QuickStats profile={profile} />

      {/* Active passive effects badges */}
      {activeEffects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeEffects.map((eff, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary">
              <Shield className="w-3 h-3" />
              {eff.type === 'streak_shield' && 'Захист стріку'}
              {eff.type === 'penalty_immunity' && 'Імунітет штрафів'}
              {eff.type === 'xp_multiplier' && `XP x${eff.value}`}
              {eff.type === 'weight_reduce' && `-${eff.value} кг ваги`}
              {eff.type === 'legendary_buff' && 'Легендарний бафф'}
            </span>
          ))}
        </div>
      )}

      <GoalProgress profile={profile} />

      <div className="grid md:grid-cols-2 gap-6">
        <WeightChart logs={logs} />
        <StepGoals todaySteps={todayLog?.steps || 0} />
      </div>

      <MilestoneTracker profile={profile} />
    </div>
  );
}