import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Footprints, Banknote, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, color, delay, alert }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn(
        "rounded-xl bg-card border border-border p-4",
        alert === "yellow" && "border-yellow-500/30 bg-yellow-500/5",
        alert === "red" && "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      {alert && alert !== "none" && (
        <div className={cn(
          "flex items-center gap-1 mt-2 text-[10px]",
          alert === "yellow" ? "text-yellow-500" : "text-destructive"
        )}>
          <AlertTriangle className="w-3 h-3" />
          {alert === "yellow" ? "Жовта зона!" : "Червона зона!"}
        </div>
      )}
    </motion.div>
  );
}

export default function QuickStats({ profile }) {
  const weightLost = Math.max(0, (profile.start_weight || 96) - (profile.current_weight || 96));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={TrendingDown}
        label="Скинуто"
        value={`${weightLost.toFixed(1)} кг`}
        color="text-green-400"
        delay={0.05}
      />
      <StatCard
        icon={Footprints}
        label="Всього кроків"
        value={(profile.total_steps || 0).toLocaleString()}
        color="text-primary"
        delay={0.1}
      />
      <StatCard
        icon={Banknote}
        label="Заощаджено"
        value={`${(profile.total_money_saved || 0).toLocaleString()} ₴`}
        color="text-accent"
        delay={0.15}
      />
      <StatCard
        icon={TrendingDown}
        label="Поточна вага"
        value={`${(profile.current_weight || 96).toFixed(1)} кг`}
        color="text-foreground"
        delay={0.2}
        alert={profile.penalty_zone}
      />
    </div>
  );
}