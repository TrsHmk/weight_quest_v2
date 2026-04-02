import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, BarChart3, Package, Swords, Trophy } from "lucide-react";
import { ARTIFACTS, CHESTS, RARITY_CONFIG } from "@/lib/artifacts";
import ArtifactIcon from "@/components/ArtifactIcon";
import { DIFFICULTY_CONFIG } from "@/lib/quests";

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const TYPE_META = {
  xp_bonus:          { label: 'Бафи XP',        emoji: '⚡', color: 'text-yellow-400' },
  debuff_quest:      { label: 'Дебаф-квести',    emoji: '😅', color: 'text-orange-400' },
  debuff_or_penalty: { label: 'Штрафи',          emoji: '⚠️', color: 'text-red-400' },
  xp_penalty:        { label: 'Покарання XP',    emoji: '💀', color: 'text-red-500' },
  allow_beer:        { label: 'Дозвіл на пиво',  emoji: '🍺', color: 'text-amber-400' },
  allow_fastfood:    { label: 'Дозвіл на їжу',   emoji: '🍔', color: 'text-green-400' },
  penalty_immunity:  { label: 'Імунітет',         emoji: '🛡️', color: 'text-blue-400' },
  streak_shield:     { label: 'Захист стріку',    emoji: '🔥', color: 'text-orange-300' },
  weight_reduce:     { label: 'Зниження ваги',    emoji: '⚖️', color: 'text-cyan-400' },
  xp_multiplier:     { label: 'Множник XP',       emoji: '✖️', color: 'text-purple-400' },
  legendary_buff:    { label: 'Легенд. бафи',     emoji: '👑', color: 'text-yellow-300' },
  gamble:            { label: 'Гембл',            emoji: '🎲', color: 'text-pink-400' },
  debuff_quest_bonus:{ label: 'Квест-бафи',       emoji: '🎯', color: 'text-indigo-400' },
  steps_bonus:       { label: 'Бонуси кроків',    emoji: '👟', color: 'text-teal-400' },
};

function StatCard({ icon, label, value, sub, color = 'text-primary' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
        <span>{icon}</span><span>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

export default function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => base44.api.get('/stats'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const inv = data?.inventory || [];
  const quests = data?.quests || { total: 0, completed: 0, byDifficulty: {} };

  // Artifact counts by rarity
  const artifactsByRarity = Object.fromEntries(RARITY_ORDER.map(r => [r, { total: 0, unique: new Set() }]));
  const chestsByRarity    = Object.fromEntries(RARITY_ORDER.map(r => [r, 0]));

  inv.forEach(row => {
    const art   = ARTIFACTS.find(a => a.id === row.artifact_id);
    const chest = CHESTS.find(c => c.id === row.artifact_id);
    if (art) {
      artifactsByRarity[art.rarity].total += parseInt(row.total);
      artifactsByRarity[art.rarity].unique.add(art.id);
    }
    if (chest) chestsByRarity[chest.rarity] += parseInt(row.total);
  });

  // Artifact counts by type
  const byType = {};
  inv.forEach(row => {
    const art = ARTIFACTS.find(a => a.id === row.artifact_id);
    if (!art || !TYPE_META[art.type]) return;
    byType[art.type] = (byType[art.type] || 0) + parseInt(row.total);
  });

  const totalArtifacts = Object.values(artifactsByRarity).reduce((s, v) => s + v.total, 0);
  const totalChests    = Object.values(chestsByRarity).reduce((a, b) => a + b, 0);
  const uniqueArtifacts = Object.values(artifactsByRarity).reduce((s, v) => s + v.unique.size, 0);

  // Rarest artifact owned
  const legendaryOwned = inv
    .map(r => ({ row: r, art: ARTIFACTS.find(a => a.id === r.artifact_id && a.rarity === 'legendary') }))
    .filter(x => x.art)
    .sort((a, b) => b.row.total - a.row.total)[0];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-pixel text-sm text-accent tracking-wider">📊 СТАТИСТИКА</h1>
          <p className="text-xs text-muted-foreground">Твій шлях у цифрах • {ARTIFACTS.length} артефактів у грі</p>
        </div>
      </div>

      {/* Top counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon="📦" label="Всього артефактів"  value={totalArtifacts}  sub={`${uniqueArtifacts}/${ARTIFACTS.length} унікальних`} color="text-primary" />
        <StatCard icon="🗃️" label="Скринь отримано"   value={totalChests}     sub="відкритих та нових"     color="text-yellow-400" />
        <StatCard icon="⚔️" label="Квестів виконано"  value={quests.completed} sub={`з ${quests.total} всього`} color="text-green-400" />
        <StatCard icon="📅" label="Днів записано"      value={data?.totalDays || 0} sub="щоденних записів" color="text-blue-400" />
      </div>

      {/* Artifacts by rarity */}
      <section className="mb-8">
        <h2 className="font-pixel text-[10px] text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <Package className="w-3 h-3" /> Колекція по рідкісності
        </h2>
        <div className="space-y-2">
          {RARITY_ORDER.map((rarity, i) => {
            const cfg        = RARITY_CONFIG[rarity];
            const { total, unique } = artifactsByRarity[rarity];
            const maxUnique  = ARTIFACTS.filter(a => a.rarity === rarity).length;
            const pct        = maxUnique > 0 ? (unique.size / maxUnique) * 100 : 0;
            return (
              <motion.div
                key={rarity}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-lg border p-3 ${cfg.border} ${cfg.bg}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {unique.size}/{maxUnique} унікальних • {total} всього
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/20 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cfg.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.07 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quests by difficulty */}
      <section className="mb-8">
        <h2 className="font-pixel text-[10px] text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
          <Swords className="w-3 h-3" /> Квести по складності
        </h2>
        {quests.completed === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Квестів ще не виконано. Починай!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(quests.byDifficulty).map(([diff, count]) => {
              const cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.easy;
              return (
                <motion.div
                  key={diff}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-lg border p-3 ${cfg.border} bg-card`}
                >
                  <p className={`text-[10px] font-pixel uppercase ${cfg.color} mb-1`}>{cfg.label}</p>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">виконано</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Type breakdown */}
      {Object.keys(byType).length > 0 && (
        <section className="mb-8">
          <h2 className="font-pixel text-[10px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Trophy className="w-3 h-3" /> Типи отриманих артефактів
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const meta = TYPE_META[type];
                if (!meta) return null;
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg bg-secondary/50 border border-border p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <div>
                      <p className={`text-xs font-semibold ${meta.color}`}>{meta.label}</p>
                      <p className="text-lg font-bold text-foreground">{count}×</p>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      )}

      {/* Rarest artifact */}
      {legendaryOwned && (
        <section>
          <h2 className="font-pixel text-[10px] text-yellow-400 uppercase tracking-widest mb-3">
            ⭐ Найрідкісніший артефакт у колекції
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border-2 p-5 flex items-center gap-4 ${RARITY_CONFIG.legendary.border} ${RARITY_CONFIG.legendary.bg} ${RARITY_CONFIG.legendary.glow}`}
          >
            <ArtifactIcon icon={legendaryOwned.art.icon} alt={legendaryOwned.art.name} size="w-14 h-14" />
            <div>
              <p className="font-bold text-foreground text-lg">{legendaryOwned.art.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{legendaryOwned.art.desc}</p>
              <p className="text-sm text-yellow-400 font-medium mt-1.5">{legendaryOwned.art.effect}</p>
            </div>
          </motion.div>
        </section>
      )}

      {totalArtifacts === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-pixel text-xs">Статистика порожня</p>
          <p className="text-sm mt-2">Роби записи, виконуй квести — і тут з'явиться щось цікаве</p>
        </div>
      )}
    </div>
  );
}
