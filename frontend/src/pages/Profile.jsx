import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LEVELS, MILESTONES, ACHIEVEMENTS, getLevelForXP } from "@/lib/gameConfig";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Flame, Footprints, Banknote, TrendingDown,
  Zap, Star, Target, Scale
} from "lucide-react";

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export default function Profile() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 100),
  });

  const profile = profiles[0] || {
    total_xp: 0, current_level: 1, current_streak: 0, best_streak: 0,
    start_weight: 96, current_weight: 96, lowest_weight: 96,
    total_money_saved: 0, total_steps: 0, unlocked_milestones: [],
    unlocked_achievements: [],
  };

  const level = getLevelForXP(profile.total_xp || 0);
  const weightLost = Math.max(0, (profile.start_weight || 96) - (profile.current_weight || 96));
  const avgSteps = logs.length > 0 
    ? Math.round(logs.reduce((sum, l) => sum + (l.steps || 0), 0) / logs.length)
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Avatar & Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-5xl mx-auto mb-4 glow-purple">
          {level.avatar}
        </div>
        <h1 className="font-pixel text-sm text-accent">{level.name}</h1>
        <p className="text-xs text-muted-foreground mt-1">Рівень {level.level}</p>
      </motion.div>

      {/* Level progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        <h3 className="font-pixel text-[10px] text-accent mb-4">📊 РІВНІ</h3>
        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const isCurrentOrPast = (profile.total_xp || 0) >= lvl.xpRequired;
            const isCurrent = lvl.level === level.level;
            return (
              <div key={lvl.level} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${isCurrent ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                  {isCurrentOrPast ? lvl.avatar : "🔒"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                      {lvl.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{lvl.xpRequired} XP</span>
                  </div>
                  <Progress
                    value={isCurrentOrPast ? 100 : Math.min(((profile.total_xp || 0) / lvl.xpRequired) * 100, 100)}
                    className="h-1 mt-1 bg-secondary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        <h3 className="font-pixel text-[10px] text-accent mb-4">📈 СТАТИСТИКА</h3>
        <StatRow icon={Zap} label="Загальний XP" value={profile.total_xp || 0} color="text-accent" />
        <StatRow icon={Scale} label="Поточна вага" value={`${(profile.current_weight || 96).toFixed(1)} кг`} color="text-foreground" />
        <StatRow icon={TrendingDown} label="Скинуто" value={`${weightLost.toFixed(1)} кг`} color="text-green-400" />
        <StatRow icon={Target} label="Мінімальна вага" value={`${(profile.lowest_weight || 96).toFixed(1)} кг`} color="text-primary" />
        <StatRow icon={Flame} label="Поточний стрік" value={`${profile.current_streak || 0} днів`} color="text-orange-500" />
        <StatRow icon={Star} label="Найкращий стрік" value={`${profile.best_streak || 0} днів`} color="text-accent" />
        <StatRow icon={Footprints} label="Всього кроків" value={(profile.total_steps || 0).toLocaleString()} color="text-primary" />
        <StatRow icon={Footprints} label="Середні кроки/день" value={avgSteps.toLocaleString()} color="text-primary" />
        <StatRow icon={Banknote} label="Заощаджено" value={`${(profile.total_money_saved || 0).toLocaleString()} ₴`} color="text-green-400" />
        <StatRow icon={Trophy} label="Мілстоунів" value={`${(profile.unlocked_milestones || []).length} / ${MILESTONES.length}`} color="text-accent" />
        <StatRow icon={Trophy} label="Досягнень" value={`${ACHIEVEMENTS.filter(a => a.condition(profile)).length} / ${ACHIEVEMENTS.length}`} color="text-accent" />
        <StatRow icon={Star} label="Записів" value={logs.length} color="text-muted-foreground" />
      </motion.div>
    </div>
  );
}