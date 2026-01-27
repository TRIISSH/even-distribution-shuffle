import { RoundData, ShuffleConfig } from "@/lib/shuffleAlgorithm";
import { GroupCard } from "./GroupCard";
import { Clock } from "lucide-react";

interface RoundDisplayProps {
  round: RoundData;
  isActive?: boolean;
  isAnimating?: boolean;
  config: ShuffleConfig;
}

export function RoundDisplay({ round, isActive, isAnimating, config }: RoundDisplayProps) {
  const startTime = (round.roundNumber - 1) * config.minutesPerRound;
  const endTime = round.roundNumber * config.minutesPerRound;
  
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  };

  // Determine optimal grid columns based on number of groups
  const getGridCols = () => {
    if (config.numGroups <= 3) return "grid-cols-1 md:grid-cols-3";
    if (config.numGroups <= 5) return "grid-cols-2 md:grid-cols-5";
    if (config.numGroups <= 10) return "grid-cols-3 md:grid-cols-5";
    return "grid-cols-3 md:grid-cols-5";
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        isActive ? "ring-2 ring-primary glow" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold font-mono">
            {round.roundNumber}
          </div>
          <div>
            <h3 className="font-semibold text-lg">Round {round.roundNumber}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
            </div>
          </div>
        </div>
        {isActive && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground animate-pulse">
            Active
          </span>
        )}
      </div>

      <div className={`grid ${getGridCols()} gap-3`}>
        {round.groups.map((group) => (
          <GroupCard
            key={group.groupId}
            group={group}
            isAnimating={isAnimating}
            config={config}
          />
        ))}
      </div>
    </div>
  );
}
