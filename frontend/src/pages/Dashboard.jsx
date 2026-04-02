import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PlayerCard from "@/components/dashboard/PlayerCard";
import QuickStats from "@/components/dashboard/QuickStats";
import WeightChart from "@/components/dashboard/WeightChart";
import MilestoneTracker from "@/components/dashboard/MilestoneTracker";
import StepGoals from "@/components/dashboard/StepGoals";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["daily-logs"],
    queryFn: () => base44.entities.DailyLog.list("-date", 60),
  });

  const profile = profiles[0] || {};
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayLog = logs.find(l => l.date === todayStr);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm md:text-base text-primary">WEIGHT QUEST</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
        </div>
        {!todayLog && (
          <a
            href="/log"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors glow-purple"
          >
            + Записати день
          </a>
        )}
      </div>

      <PlayerCard profile={profile} />
      <QuickStats profile={profile} />

      <div className="grid md:grid-cols-2 gap-6">
        <WeightChart logs={logs} />
        <StepGoals todaySteps={todayLog?.steps || 0} />
      </div>

      <MilestoneTracker profile={profile} />
    </div>
  );
}