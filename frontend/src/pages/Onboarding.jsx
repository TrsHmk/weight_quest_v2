import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Scale, Target, Swords, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Onboarding() {
  const [startWeight, setStartWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const queryClient = useQueryClient();

  const createProfile = useMutation({
    mutationFn: async () => {
      const sw = parseFloat(startWeight);
      const gw = parseFloat(goalWeight);
      await base44.entities.PlayerProfile.create({
        start_weight: sw,
        current_weight: sw,
        lowest_weight: sw,
        goal_weight: gw,
        total_xp: 0,
        current_level: 1,
        current_streak: 0,
        best_streak: 0,
        total_money_saved: 0,
        total_steps: 0,
        unlocked_milestones: [],
        unlocked_achievements: [],
        frozen_privileges: [],
        penalty_zone: "none",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-profile"] });
    },
  });

  const sw = parseFloat(startWeight);
  const gw = parseFloat(goalWeight);
  const valid = !isNaN(sw) && !isNaN(gw) && sw > 0 && gw > 0 && gw < sw;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-5xl mx-auto mb-4 glow-purple">
            ⚔️
          </div>
          <h1 className="font-pixel text-sm text-accent mb-2">ЛАСКАВО ПРОСИМО!</h1>
          <p className="text-sm text-muted-foreground">
            Вкажи свою поточну вагу та ціль, щоб розпочати пригоду
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Scale className="w-4 h-4 text-primary" />
              Поточна вага (кг)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Наприклад: 96.0"
              value={startWeight}
              onChange={e => setStartWeight(e.target.value)}
              className="bg-secondary border-border text-lg h-12"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Target className="w-4 h-4 text-accent" />
              Цільова вага (кг)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Наприклад: 80.0"
              value={goalWeight}
              onChange={e => setGoalWeight(e.target.value)}
              className="bg-secondary border-border text-lg h-12"
            />
            {goalWeight && !isNaN(gw) && !isNaN(sw) && gw >= sw && (
              <p className="text-xs text-destructive mt-1">
                Ціль має бути менша за поточну вагу
              </p>
            )}
          </div>

          {valid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-center"
            >
              <p className="text-muted-foreground">
                Потрібно скинути{" "}
                <span className="font-bold text-accent">
                  {(sw - gw).toFixed(1)} кг
                </span>
              </p>
            </motion.div>
          )}

          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-purple"
            onClick={() => createProfile.mutate()}
            disabled={!valid || createProfile.isPending}
          >
            {createProfile.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Swords className="w-5 h-5 mr-2" />
                Розпочати пригоду!
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
