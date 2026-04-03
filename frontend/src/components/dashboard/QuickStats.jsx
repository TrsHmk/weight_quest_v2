import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Footprints, Banknote, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Дрищ 💀",              color: "text-blue-400" };
  if (bmi < 25)   return { label: "Норм пацан ✅",         color: "text-green-400" };
  if (bmi < 30)   return { label: "Злегка пузатий 🍺",    color: "text-yellow-500" };
  if (bmi < 35)   return { label: "Скуф I ступеня 🧔",    color: "text-orange-500" };
  if (bmi < 40)   return { label: "Скуф II ступеня 🐷",   color: "text-red-500" };
  return           { label: "Легендарний Скуф 👑",         color: "text-red-700" };
}

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
  const height = profile.height;
  const bmi = height ? (profile.current_weight || 96) / ((height / 100) ** 2) : null;
  const bmiCat = bmi ? getBmiCategory(bmi) : null;

  return (
    <div className={cn("grid gap-3", bmi ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4")}>
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
      {bmi && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl bg-card border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className={cn("w-4 h-4", bmiCat.color)} />
            <span className="text-xs text-muted-foreground">ІМТ</span>
          </div>
          <p className="text-xl font-bold text-foreground">{bmi.toFixed(1)}</p>
          <p className={cn("text-[10px] mt-1 font-medium", bmiCat.color)}>{bmiCat.label}</p>
        </motion.div>
      )}
    </div>
  );
}