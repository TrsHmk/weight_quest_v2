import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { getLevelForXP, getNextLevel, LEVELS } from "@/lib/gameConfig";
import { Flame, Zap, Star } from "lucide-react";

export default function PlayerCard({ profile }) {
  const level = getLevelForXP(profile.total_xp || 0);
  const nextLevel = getNextLevel(level.level);
  
  const xpInLevel = (profile.total_xp || 0) - level.xpRequired;
  const xpForNext = nextLevel ? nextLevel.xpRequired - level.xpRequired : 1;
  const progress = nextLevel ? Math.min((xpInLevel / xpForNext) * 100, 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 p-6"
    >
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary flex items-center justify-center text-3xl md:text-4xl border border-border glow-purple">
          {level.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-pixel text-[10px] text-accent">LVL {level.level}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm font-bold text-foreground">{level.name}</span>
          </div>
          
          {/* XP Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-accent" />
                {profile.total_xp || 0} XP
              </span>
              {nextLevel && <span>{nextLevel.xpRequired} XP</span>}
            </div>
            <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
          </div>
          
          {/* Stats row */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-muted-foreground">Стрік</span>
              <span className="font-bold text-foreground">{profile.current_streak || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-muted-foreground">Найкращий</span>
              <span className="font-bold text-foreground">{profile.best_streak || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}