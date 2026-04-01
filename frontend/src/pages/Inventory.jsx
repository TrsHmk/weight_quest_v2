import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Backpack, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ARTIFACTS, RARITY_CONFIG, getArtifact } from "@/lib/artifacts";

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
        <span className="text-3xl">{artifact.icon}</span>
        <span className={`text-[9px] font-pixel uppercase tracking-widest ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground leading-tight">{artifact.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{artifact.desc}</p>
      </div>
      <p className={`text-xs font-medium mt-auto ${cfg.color}`}>{artifact.effect}</p>

      {!item.used && (
        <Button
          size="sm"
          variant="outline"
          className={`mt-1 w-full text-xs h-8 border ${cfg.border} ${cfg.color} hover:opacity-80`}
          onClick={() => onUse(item.id)}
          disabled={isUsing}
        >
          {isUsing ? <Loader2 className="w-3 h-3 animate-spin" /> : '⚡ Використати'}
        </Button>
      )}

      {item.used && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3" />
          <span>Використано</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Inventory() {
  const [usingId, setUsingId] = useState(null);
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

  const active = items.filter(i => !i.used);
  const used = items.filter(i => i.used);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Backpack className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-pixel text-sm text-accent tracking-wider">🎒 ІНВЕНТАР</h1>
          <p className="text-xs text-muted-foreground">Артефакти, що впали під час подорожі</p>
        </div>
      </div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-muted-foreground"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-pixel text-xs">Інвентар порожній</p>
          <p className="text-sm mt-2">Роби щоденні записи — артефакти падають з шансом 25%</p>
        </motion.div>
      )}

      {active.length > 0 && (
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Активні ({active.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence>
              {active.map(item => (
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

      {used.length > 0 && (
        <section>
          <h2 className="font-pixel text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
            Використані ({used.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {used.map(item => (
              <ArtifactCard key={item.id} item={item} onUse={() => {}} isUsing={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
