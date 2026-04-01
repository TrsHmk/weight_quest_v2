import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Swords, CheckCircle2, Lock } from "lucide-react";
import { format } from "date-fns";
import { DIFFICULTY_CONFIG, getQuestProgress } from "@/lib/quests";
import { getChest, RARITY_CONFIG } from "@/lib/artifacts";

function QuestCard({ quest, progress }) {
  const diff = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.easy;
  const chest = getChest(quest.chest);
  const chestCfg = chest ? RARITY_CONFIG[chest.rarity] : null;
  const pct = Math.round(progress * 100);
  const done = quest.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all
        ${done
          ? 'border-green-600/60 bg-green-900/10 opacity-70'
          : `${diff.border} bg-card`
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{quest.icon}</span>
          <div>
            <p className="font-semibold text-sm text-foreground">{quest.name}</p>
            <p className="text-xs text-muted-foreground">{quest.desc}</p>
          </div>
        </div>
        {done && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
      </div>

      {/* Progress bar */}
      {!done && quest.type !== 'log' && quest.type !== 'weight_loss' && quest.type !== 'not_red' && (
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Прогрес</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${diff.color.replace('text-', 'bg-')}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {/* Reward */}
      <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 w-fit
        ${done ? 'bg-green-900/20 text-green-400' : 'bg-secondary text-muted-foreground'}`}>
        {done ? (
          <><span>{chest?.icon}</span><span>Отримано: {chest?.name}</span></>
        ) : (
          <><Lock className="w-3 h-3" /><span>Нагорода: </span>
            <span className={chestCfg?.color}>{chest?.icon} {chest?.name}</span></>
        )}
      </div>
    </motion.div>
  );
}

export default function Quests() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const { data: questRow, isLoading: loadingQuests } = useQuery({
    queryKey: ['quests', todayStr],
    queryFn: () => base44.api.get('/quests'),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['daily-logs'],
    queryFn: () => base44.entities.DailyLog.list('-date', 3),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['player-profile'],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const todayLog = logs.find(l => l.date === todayStr);
  const prevLog  = logs.find(l => l.date !== todayStr);
  const profile  = profiles[0];
  const streak   = profile?.current_streak || 0;

  const ctx = {
    steps:      todayLog?.steps || 0,
    streak,
    logged:     !!todayLog,
    weightLost: todayLog && prevLog ? (todayLog.weight < prevLog.weight) : false,
    notRed:     todayLog ? todayLog.penalty_zone !== 'red' : true,
  };

  const quests = questRow?.quests || [];

  if (loadingQuests) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Swords className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-pixel text-sm text-accent tracking-wider">⚔️ ЩОДЕННІ КВЕСТИ</h1>
          <p className="text-xs text-muted-foreground">Виконай — отримай скриню. Оновлюються о 00:00.</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-6 ml-11">
        {format(new Date(), "EEEE, d MMMM")} • {quests.filter(q => q.completed).length}/{quests.length} виконано
      </p>

      <div className="space-y-3">
        {quests.map((quest, i) => (
          <QuestCard
            key={quest.id || i}
            quest={quest}
            progress={getQuestProgress(quest, ctx)}
          />
        ))}
      </div>

      {quests.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Swords className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-pixel text-xs">Квести генеруються...</p>
        </div>
      )}
    </div>
  );
}
