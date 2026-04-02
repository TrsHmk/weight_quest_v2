import React from "react";
import { motion } from "framer-motion";
import { MILESTONES } from "@/lib/gameConfig";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MilestoneTracker({ profile }) {
  const unlockedSet = new Set(profile.unlocked_milestones || []);
  const frozenMap = {};
  (profile.frozen_privileges || []).forEach(f => {
    frozenMap[f.milestone_index] = f.frozen_until;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <h3 className="font-pixel text-[10px] text-accent mb-4">🎯 МІЛСТОУНИ</h3>
      <div className="space-y-3">
        {MILESTONES.map((m) => {
          const unlocked = unlockedSet.has(m.target);
          const frozen = frozenMap[m.target];
          const isFrozen = frozen && new Date(frozen) > new Date();

          return (
            <div
              key={m.target}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                unlocked && !isFrozen && "bg-primary/5 border-primary/20",
                unlocked && isFrozen && "bg-destructive/5 border-destructive/20",
                !unlocked && "bg-secondary/30 border-border opacity-60"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                unlocked ? "bg-primary/10" : "bg-secondary"
              )}>
                {unlocked ? m.emoji : "🔒"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate">{m.label}</span>
                  <span className="font-pixel text-[8px] text-muted-foreground">{m.target} кг</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.reward}</p>
                {isFrozen && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    Заморожено до {new Date(frozen).toLocaleDateString('uk')}
                  </p>
                )}
              </div>
              {unlocked ? (
                <Unlock className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}