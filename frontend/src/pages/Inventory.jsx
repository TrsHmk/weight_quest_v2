import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Backpack, Sparkles, CheckCircle2, Loader2, Package, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ARTIFACTS, RARITY_CONFIG, getArtifact, getChest, getItem, openChest, checkSets, ARTIFACT_SETS } from "@/lib/artifacts";
import ArtifactIcon from "@/components/ArtifactIcon";

function ArtifactCard({ item, onUse, isUsing }) {
  const artifact = getArtifact(item.artifact_id);
  if (!artifact) return null;
  const cfg = RARITY_CONFIG[artifact.rarity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className={`relative rounded-xl border p-4 flex flex-col gap-2 ${cfg.border} ${cfg.bg} ${cfg.glow} ${item.used ? 'opacity-40 grayscale' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <ArtifactIcon icon={artifact.icon} alt={artifact.name} size="w-10 h-10" />
        <span className={`text-[9px] font-pixel uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground leading-tight">{artifact.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{artifact.desc}</p>
      </div>
      <p className={`text-xs font-medium mt-auto ${cfg.color}`}>{artifact.effect}</p>

      {!item.used ? (
        <Button
          size="sm" variant="outline"
          className={`mt-1 w-full text-xs h-8 border ${cfg.border} ${cfg.color} hover:opacity-80`}
          onClick={() => onUse(item.id)}
          disabled={isUsing}
        >
          {isUsing ? <Loader2 className="w-3 h-3 animate-spin" /> : '⚡ Використати'}
        </Button>
      ) : (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3" /><span>Використано</span>
        </div>
      )}
    </motion.div>
  );
}

function ChestCard({ item, onOpen, isOpening }) {
  const chest = getChest(item.artifact_id);
  if (!chest) return null;
  const cfg = RARITY_CONFIG[chest.rarity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className={`relative rounded-xl border p-4 flex flex-col gap-2 ${cfg.border} ${cfg.bg} ${cfg.glow} ${item.used ? 'opacity-40 grayscale' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <motion.div
          animate={isOpening ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1.2, 1.2, 1.2, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <ArtifactIcon icon={chest.icon} alt={chest.name} size="w-10 h-10" />
        </motion.div>
        <span className={`text-[9px] font-pixel uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground leading-tight">{chest.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{chest.desc}</p>
      </div>
      <p className={`text-xs font-medium mt-auto ${cfg.color}`}>
        Містить: {chest.rarityPool.map(r => RARITY_CONFIG[r]?.label).join(' / ')}
      </p>

      {!item.used ? (
        <Button
          size="sm"
          className={`mt-1 w-full text-xs h-8 bg-gradient-to-r from-purple-600 to-yellow-600 hover:opacity-90 text-white border-0`}
          onClick={() => onOpen(item)}
          disabled={isOpening}
        >
          {isOpening ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
          ) : '🎲 Відкрити'}
        </Button>
      ) : (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3" /><span>Відкрито</span>
        </div>
      )}
    </motion.div>
  );
}

// Reveal overlay when opening chest
function ChestReveal({ artifact, onClose }) {
  const cfg = RARITY_CONFIG[artifact.rarity];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`rounded-2xl border-2 p-8 text-center max-w-sm mx-4 ${cfg.border} ${cfg.bg} ${cfg.glow}`}
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          className="flex justify-center mb-4"
        >
          <ArtifactIcon icon={artifact.icon} alt={artifact.name} size="w-20 h-20" />
        </motion.div>
        <p className={`font-pixel text-[10px] uppercase tracking-widest mb-2 ${cfg.color}`}>
          ✨ {cfg.label} артефакт!
        </p>
        <h2 className="text-xl font-bold text-foreground mb-2">{artifact.name}</h2>
        <p className="text-sm text-muted-foreground mb-3">{artifact.desc}</p>
        <p className={`text-sm font-semibold ${cfg.color}`}>{artifact.effect}</p>
        <Button className="mt-6 w-full" onClick={onClose}>Забрати до інвентаря</Button>
      </motion.div>
    </motion.div>
  );
}

function SetCard({ set }) {
  const completed = set.completed;
  const progress = set.ownedCount / set.pieces.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all
        ${completed
          ? 'border-yellow-400/80 bg-yellow-900/20 shadow-yellow-400/30 shadow-md'
          : 'border-border bg-card'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{set.icon}</span>
          <div>
            <p className={`font-bold text-sm ${completed ? 'text-yellow-400' : 'text-foreground'}`}>
              {set.name}
            </p>
            <p className="text-xs text-muted-foreground">{set.desc}</p>
          </div>
        </div>
        {completed && (
          <span className="font-pixel text-[9px] text-yellow-400 uppercase tracking-widest shrink-0">Сет!</span>
        )}
      </div>

      {/* Pieces */}
      <div className="flex gap-1.5 flex-wrap">
        {set.pieces.map(pid => {
          const art = ARTIFACTS.find(a => a.id === pid);
          const owned = set.ownedCount > 0 && set.pieces.slice(0, set.ownedCount).includes(pid);
          // check if this specific piece is owned
          const pieceOwned = set._ownedSet?.has(pid) ?? false;
          return (
            <div
              key={pid}
              title={art?.name || pid}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base
                ${pieceOwned ? 'bg-primary/15 border border-primary/30' : 'bg-secondary border border-border opacity-40'}`}
            >
              {art?.icon || '❓'}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>{set.ownedCount}/{set.pieces.length} частин</span>
          {completed && <span className="text-yellow-400">✓ Виконано!</span>}
        </div>
        <div className="h-1.5 rounded-full bg-black/20 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${completed ? 'bg-yellow-400' : 'bg-primary'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Bonus */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-lg bg-yellow-900/30 border border-yellow-400/40 px-3 py-2"
        >
          <p className="text-[10px] font-pixel text-yellow-400 mb-1">🎁 БОНУС СЕТУ</p>
          <p className="text-xs text-yellow-300">{set.bonus}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Inventory() {
  const [usingId, setUsingId] = useState(null);
  const [openingItem, setOpeningItem] = useState(null);
  const [revealedArtifact, setRevealedArtifact] = useState(null);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => base44.api.get('/inventory'),
  });

  const useMutation_ = useMutation({
    mutationFn: (id) => base44.api.post(`/inventory/${id}/use`),
    onMutate: (id) => setUsingId(id),
    onSettled: () => setUsingId(null),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      const item = items.find(i => i.id === id);
      const artifact = item ? getArtifact(item.artifact_id) : null;
      if (artifact) toast.success(`${artifact.icon} ${artifact.name} використано!`);
    },
    onError: () => toast.error('Не вдалося використати артефакт'),
  });

  const openMutation = useMutation({
    mutationFn: ({ id, rolledArtifactId }) =>
      base44.api.post(`/inventory/${id}/open`, { artifact_id: rolledArtifactId }),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      const artifact = getArtifact(newItem.artifact_id);
      if (artifact) setRevealedArtifact(artifact);
      setOpeningItem(null);
    },
    onError: () => {
      setOpeningItem(null);
      toast.error('Не вдалося відкрити скриню');
    },
  });

  function handleOpenChest(item) {
    const chest = getChest(item.artifact_id);
    if (!chest) return;
    const artifact = openChest(chest);
    if (!artifact) return;
    setOpeningItem(item.id);
    setTimeout(() => {
      openMutation.mutate({ id: item.id, rolledArtifactId: artifact.id });
    }, 700);
  }

  const chests = items.filter(i => !i.used && getChest(i.artifact_id));
  const usedChests = items.filter(i => i.used && getChest(i.artifact_id));
  const activeArtifacts = items.filter(i => !i.used && getArtifact(i.artifact_id));
  const usedArtifacts = items.filter(i => i.used && getArtifact(i.artifact_id));

  const ownedArtifactIds = new Set(items.map(i => i.artifact_id));
  const sets = checkSets(items).map(s => ({ ...s, _ownedSet: ownedArtifactIds }));
  const completedSets = sets.filter(s => s.completed);
  const incompleteSets = sets.filter(s => !s.completed);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <AnimatePresence>
        {revealedArtifact && (
          <ChestReveal artifact={revealedArtifact} onClose={() => setRevealedArtifact(null)} />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-8">
        <Backpack className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-pixel text-sm text-accent tracking-wider">🎒 ІНВЕНТАР</h1>
          <p className="text-xs text-muted-foreground">Артефакти та скрині, що впали під час подорожі</p>
        </div>
      </div>

      {/* Sets section */}
      {completedSets.length > 0 && (
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Активні Сети ({completedSets.length}) 🔥
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedSets.map(set => <SetCard key={set.id} set={set} />)}
          </div>
        </section>
      )}

      {incompleteSets.filter(s => s.ownedCount > 0).length > 0 && (
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Сети в процесі
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incompleteSets.filter(s => s.ownedCount > 0).map(set => <SetCard key={set.id} set={set} />)}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-pixel text-xs">Інвентар порожній</p>
          <p className="text-sm mt-2">Роби щоденні записи — артефакти (25%) та скрині (10%) падають рандомно</p>
        </motion.div>
      )}

      {chests.length > 0 && (
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Package className="w-3 h-3" /> Скрині ({chests.length}) — відкрий щоб дізнатись!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {chests.map(item => (
                <ChestCard
                  key={item.id}
                  item={item}
                  onOpen={handleOpenChest}
                  isOpening={openingItem === item.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {activeArtifacts.length > 0 && (
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Активні ({activeArtifacts.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {activeArtifacts.map(item => (
                <ArtifactCard
                  key={item.id}
                  item={item}
                  onUse={(id) => useMutation_.mutate(id)}
                  isUsing={usingId === item.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {(usedArtifacts.length > 0 || usedChests.length > 0) && (
        <section>
          <h2 className="font-pixel text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
            Використані ({usedArtifacts.length + usedChests.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {usedChests.map(item => (
              <ChestCard key={item.id} item={item} onOpen={() => {}} isOpening={false} />
            ))}
            {usedArtifacts.map(item => (
              <ArtifactCard key={item.id} item={item} onUse={() => {}} isUsing={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
