import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Footprints, Zap, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_TIERS = [
  { target: 5000, xp: 30, money: 10, color: "text-green-400" },
  { target: 7000, xp: 50, money: 20, color: "text-primary" },
  { target: 12000, xp: 80, money: 30, color: "text-accent" },
];

export default function StepGoals({ todaySteps = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <h3 className="font-pixel text-[10px] text-accent mb-4">
        <Footprints className="w-4 h-4 inline mr-2" />
        КРОКОВІ ЦІЛІ
      </h3>
      <div className="space-y-3">
        {STEP_TIERS.map((tier) => {
          const progress = Math.min((todaySteps / tier.target) * 100, 100);
          const achieved = todaySteps >= tier.target;

          return (
            <div key={tier.target} className={cn(
              "p-3 rounded-xl border",
              achieved ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-sm font-semibold", tier.color)}>
                  {tier.target.toLocaleString()} кроків
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" />{tier.xp} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-green-400" />{tier.money} ₴
                  </span>
                </div>
              </div>
              <Progress
                value={progress}
                className={cn("h-1.5 bg-secondary", achieved && "[&>div]:bg-primary")}
              />
              {achieved && (
                <p className="text-[10px] text-primary mt-1 font-medium">✓ Досягнуто!</p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}