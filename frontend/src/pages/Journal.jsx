import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Scale, Footprints, Zap, Banknote, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journal() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 100),
  });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-pixel text-sm text-accent mb-1">📜 ЖУРНАЛ ПОДІЙ</h1>
        <p className="text-xs text-muted-foreground">{logs.length} записів</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-muted-foreground text-sm">Журнал порожній</p>
          <p className="text-muted-foreground text-xs mt-1">Зроби перший запис, щоб почати квест!</p>
        </div>
      )}

      <div className="space-y-3">
        {logs.map((log, i) => {
          const prevLog = logs[i + 1]; // logs sorted desc
          const weightDiff = prevLog ? log.weight - prevLog.weight : 0;
          const isGain = weightDiff > 0;

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className={cn(
                "rounded-xl border p-4",
                log.penalty_zone === "red" && "border-destructive/30 bg-destructive/5",
                log.penalty_zone === "yellow" && "border-yellow-500/30 bg-yellow-500/5",
                (!log.penalty_zone || log.penalty_zone === "none") && "border-border bg-card"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[8px] text-muted-foreground">
                    ДЕНЬ {log.streak_day || "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(log.date), "EEEE, d MMM", { locale: uk })}
                  </span>
                </div>
                {log.xp_earned > 0 && (
                  <span className="flex items-center gap-1 text-xs text-accent font-medium">
                    <Zap className="w-3 h-3" />
                    +{log.xp_earned} XP
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Scale className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold">{log.weight} кг</span>
                  {weightDiff !== 0 && (
                    <span className={cn(
                      "text-xs flex items-center gap-0.5",
                      isGain ? "text-destructive" : "text-green-400"
                    )}>
                      {isGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isGain ? "+" : ""}{weightDiff.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Footprints className="w-3.5 h-3.5 text-primary" />
                  <span>{(log.steps || 0).toLocaleString()}</span>
                </div>
                {log.money_saved > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Banknote className="w-3.5 h-3.5 text-green-400" />
                    <span>{log.money_saved} ₴</span>
                  </div>
                )}
              </div>

              {/* Events */}
              {log.events?.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border">
                  {log.events.map((event, j) => (
                    <p key={j} className="text-xs text-muted-foreground">{event}</p>
                  ))}
                </div>
              )}

              {/* Penalty warning */}
              {log.penalty_zone && log.penalty_zone !== "none" && (
                <div className={cn(
                  "flex items-center gap-1.5 mt-2 text-xs font-medium",
                  log.penalty_zone === "yellow" ? "text-yellow-500" : "text-destructive"
                )}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {log.penalty_zone === "yellow" ? "Жовта зона" : "Червона зона"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}