import { RepetitionStats } from "@/lib/shuffleAlgorithm";
import { BarChart3, Users, Repeat, TrendingDown } from "lucide-react";

interface StatsPanelProps {
  stats: RepetitionStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  // Calculate distribution of repetitions
  const distribution: Record<number, number> = {};
  stats.pairCounts.forEach((count) => {
    distribution[count] = (distribution[count] || 0) + 1;
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Repetition Statistics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Users className="w-4 h-4" />
            Unique Pairs
          </div>
          <div className="text-2xl font-bold font-mono">{stats.uniquePairs.toLocaleString()}</div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Repeat className="w-4 h-4" />
            Total Meetings
          </div>
          <div className="text-2xl font-bold font-mono">{stats.totalPairs.toLocaleString()}</div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingDown className="w-4 h-4" />
            Max Repetitions
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.maxRepetitions}</div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <BarChart3 className="w-4 h-4" />
            Avg Repetitions
          </div>
          <div className="text-2xl font-bold font-mono">{stats.avgRepetitions.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Pair Meeting Distribution
        </h4>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(distribution)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([count, pairs]) => (
              <div
                key={count}
                className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">
                  {count}× met:
                </span>
                <span className="font-mono font-semibold">{pairs}</span>
                <span className="text-xs text-muted-foreground">pairs</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
