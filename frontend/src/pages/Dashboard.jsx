import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PlayerCard from "@/components/dashboard/PlayerCard";
import QuickStats from "@/components/dashboard/QuickStats";
import WeightChart from "@/components/dashboard/WeightChart";
import MilestoneTracker from "@/components/dashboard/MilestoneTracker";
import StepGoals from "@/components/dashboard/StepGoals";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Target, Shield } from "lucide-react";
import { getLevelForXP, getNextLevel } from "@/lib/gameConfig";

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

function LiveMessage({ profile, todayLog }) {
  const streak = profile.current_streak || 0;
  const level = getLevelForXP(profile.total_xp || 0);
  const nextLevel = getNextLevel(level.level);
  const xpToNext = nextLevel ? nextLevel.xpRequired - (profile.total_xp || 0) : null;
  const activeEffects = profile.active_effects || [];

  const messages = [];

  if (!todayLog) {
    messages.push({ icon: "⚔️", text: "Ще не записав сьогодні. Воїне, вага чекає!" });
  } else if (todayLog.penalty_zone === "red") {
    messages.push({ icon: "🚨", text: "Червона зона! Стережись — привілеї заморожено." });
  } else if (todayLog.penalty_zone === "yellow") {
    messages.push({ icon: "⚠️", text: "Жовта зона. Тримайся — ти ще можеш повернутись!" });
  } else {
    messages.push({ icon: "✅", text: "День записаний. Продовжуй у тому ж дусі!" });
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

      <LiveMessage profile={profile} todayLog={todayLog} />

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