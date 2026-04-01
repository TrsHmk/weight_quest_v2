import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/gameConfig";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Achievements() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const profile = profiles[0] || {
    total_xp: 0, current_streak: 0, best_streak: 0,
    total_steps: 0, total_money_saved: 0, current_level: 1,
    unlocked_milestones: [], unlocked_achievements: [],
  };

  const unlockedIds = new Set(profile.unlocked_achievements || []);

  // Check if newly achieved
  const newlyUnlocked = ACHIEVEMENTS.filter(a => a.condition(profile) && !unlockedIds.has(a.id));

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-pixel text-sm text-accent mb-1">🏆 ДОСЯГНЕННЯ</h1>
        <p className="text-xs text-muted-foreground">
          {ACHIEVEMENTS.filter(a => a.condition(profile) || unlockedIds.has(a.id)).length} / {ACHIEVEMENTS.length} розблоковано
        </p>
      </div>

      {newlyUnlocked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-2xl bg-accent/10 border border-accent/20 glow-gold"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-pixel text-[10px] text-accent">НОВЕ ДОСЯГНЕННЯ!</span>
          </div>
          {newlyUnlocked.map(a => (
            <p key={a.id} className="text-sm font-medium">{a.icon} {a.name} — {a.description}</p>
          ))}
        </motion.div>
      )}

      <div className="grid gap-3">
        {ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = achievement.condition(profile) || unlockedIds.has(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                isUnlocked
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                isUnlocked ? "bg-primary/10" : "bg-secondary"
              )}>
                {isUnlocked ? achievement.icon : "❓"}
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-sm font-semibold",
                  !isUnlocked && "text-muted-foreground"
                )}>
                  {isUnlocked ? achievement.name : "???"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isUnlocked ? achievement.description : "Секретне досягнення"}
                </p>
              </div>
              {isUnlocked ? (
                <span className="text-primary text-xs font-pixel">✓</span>
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}