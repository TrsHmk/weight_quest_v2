import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LEVELS, MILESTONES, ACHIEVEMENTS, getLevelForXP } from "@/lib/gameConfig";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Flame, Footprints, Banknote, TrendingDown,
  Zap, Star, Target, Scale, Ruler, Activity, Pencil, Check, X
} from "lucide-react";
import { Input } from "@/components/ui/input";

function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Дрищ 💀",              color: "text-blue-400" };
  if (bmi < 25)   return { label: "Норм пацан ✅",         color: "text-green-400" };
  if (bmi < 30)   return { label: "Злегка пузатий 🍺",    color: "text-yellow-500" };
  if (bmi < 35)   return { label: "Скуф I ступеня 🧔",    color: "text-orange-500" };
  if (bmi < 40)   return { label: "Скуф II ступеня 🐷",   color: "text-red-500" };
  return           { label: "Легендарний Скуф 👑",         color: "text-red-700" };
}

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
  const queryClient = useQueryClient();
  const [editingHeight, setEditingHeight] = useState(false);
  const [heightDraft, setHeightDraft] = useState("");

  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 100),
  });

  const profile = profiles[0];

  const heightMutation = useMutation({
    mutationFn: (h) => base44.entities.PlayerProfile.update(profile.id, { height: h }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
      setEditingHeight(false);
    },
  });

  const level = getLevelForXP(profile?.total_xp || 0);
  const weightLost = Math.max(0, (profile?.start_weight || 0) - (profile?.current_weight || 0));
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
            const isCurrentOrPast = (profile?.total_xp || 0) >= lvl.xpRequired;
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
                    value={isCurrentOrPast ? 100 : Math.min(((profile?.total_xp || 0) / lvl.xpRequired) * 100, 100)}
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
        <StatRow icon={Zap} label="Загальний XP" value={profile?.total_xp || 0} color="text-accent" />
        <StatRow icon={Scale} label="Поточна вага" value={`${(profile?.current_weight || 0).toFixed(1)} кг`} color="text-foreground" />
        {/* Height row with inline edit */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Ruler className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Зріст</span>
          </div>
          {editingHeight ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={heightDraft}
                onChange={e => setHeightDraft(e.target.value)}
                className="h-7 w-20 text-sm px-2 bg-secondary"
                placeholder="см"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') { const h = parseInt(heightDraft); if (h >= 100 && h <= 250) heightMutation.mutate(h); }
                  if (e.key === 'Escape') setEditingHeight(false);
                }}
              />
              <button onClick={() => { const h = parseInt(heightDraft); if (h >= 100 && h <= 250) heightMutation.mutate(h); }}
                className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingHeight(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {profile?.height ? `${profile.height} см` : "—"}
              </span>
              <button onClick={() => { setHeightDraft(profile?.height ? String(profile.height) : ""); setEditingHeight(true); }}
                className="text-muted-foreground hover:text-primary transition-colors">
                <Pencil className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
        {/* BMI row */}
        {profile?.height && profile?.current_weight && (() => {
          const bmi = profile.current_weight / ((profile.height / 100) ** 2);
          const cat = getBmiCategory(bmi);
          return (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Activity className={`w-4 h-4 ${cat.color}`} />
                <span className="text-sm text-muted-foreground">ІМТ</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-foreground">{bmi.toFixed(1)}</span>
                <span className={`ml-2 text-xs ${cat.color}`}>{cat.label}</span>
              </div>
            </div>
          );
        })()}
        <StatRow icon={TrendingDown} label="Скинуто" value={`${weightLost.toFixed(1)} кг`} color="text-green-400" />
        {profile?.goal_weight && (
          <StatRow icon={Target} label="Ціль" value={`${profile.goal_weight.toFixed(1)} кг`} color="text-accent" />
        )}
        <StatRow icon={Target} label="Мінімальна вага" value={`${(profile?.lowest_weight || 0).toFixed(1)} кг`} color="text-primary" />
        <StatRow icon={Flame} label="Поточний стрік" value={`${profile?.current_streak || 0} днів`} color="text-orange-500" />
        <StatRow icon={Star} label="Найкращий стрік" value={`${profile?.best_streak || 0} днів`} color="text-accent" />
        <StatRow icon={Footprints} label="Всього кроків" value={(profile?.total_steps || 0).toLocaleString()} color="text-primary" />
        <StatRow icon={Footprints} label="Середні кроки/день" value={avgSteps.toLocaleString()} color="text-primary" />
        <StatRow icon={Banknote} label="Заощаджено" value={`${(profile?.total_money_saved || 0).toLocaleString()} ₴`} color="text-green-400" />
        <StatRow icon={Trophy} label="Мілстоунів" value={`${(profile?.unlocked_milestones || []).length} / ${MILESTONES.length}`} color="text-accent" />
        <StatRow icon={Trophy} label="Досягнень" value={`${ACHIEVEMENTS.filter(a => a.condition(profile || {})).length} / ${ACHIEVEMENTS.length}`} color="text-accent" />
        <StatRow icon={Star} label="Записів" value={logs.length} color="text-muted-foreground" />
      </motion.div>
    </div>
  );
}