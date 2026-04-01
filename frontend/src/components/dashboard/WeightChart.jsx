import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { MILESTONES } from "@/lib/gameConfig";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{data.date}</p>
      <p className="text-sm font-bold text-foreground">{data.weight} кг</p>
      {data.steps > 0 && <p className="text-xs text-primary">{data.steps.toLocaleString()} кроків</p>}
    </div>
  );
};

export default function WeightChart({ logs }) {
  const chartData = logs
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30)
    .map(log => ({
      date: format(new Date(log.date), "dd.MM"),
      weight: log.weight,
      steps: log.steps || 0,
    }));

  if (chartData.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        <h3 className="font-pixel text-[10px] text-accent mb-4">📊 ПРОГРЕС ВАГИ</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Потрібно мінімум 2 записи для графіка
        </div>
      </motion.div>
    );
  }

  const weights = chartData.map(d => d.weight);
  const minW = Math.floor(Math.min(...weights) - 1);
  const maxW = Math.ceil(Math.max(...weights) + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-card border border-border p-6"
    >
      <h3 className="font-pixel text-[10px] text-accent mb-4">📊 ПРОГРЕС ВАГИ</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(250 15% 18%)" />
          <XAxis dataKey="date" tick={{ fill: 'hsl(240 10% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[minW, maxW]} tick={{ fill: 'hsl(240 10% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {MILESTONES.map(m => (
            m.target >= minW && m.target <= maxW && (
              <ReferenceLine key={m.target} y={m.target} stroke="hsl(45 100% 55%)" strokeDasharray="5 5" strokeOpacity={0.4} />
            )
          ))}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(270 80% 65%)"
            strokeWidth={2.5}
            dot={{ fill: 'hsl(270 80% 65%)', r: 3 }}
            activeDot={{ fill: 'hsl(270 80% 65%)', r: 5, stroke: 'hsl(270 80% 65%)', strokeWidth: 2, strokeOpacity: 0.3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}