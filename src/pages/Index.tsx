import { useState, useMemo } from "react";
import {
  generateOptimalRounds,
  calculateRepetitionStats,
  ShuffleConfig,
  DEFAULT_CONFIG,
  getConfigDerived,
} from "@/lib/shuffleAlgorithm";
import { RoundDisplay } from "@/components/RoundDisplay";
import { StatsPanel } from "@/components/StatsPanel";
import { UnitLookup } from "@/components/UnitLookup";
import { ConfigPanel } from "@/components/ConfigPanel";
import { Button } from "@/components/ui/button";
import { Shuffle, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const [seed, setSeed] = useState(42);
  const [config, setConfig] = useState<ShuffleConfig>(DEFAULT_CONFIG);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const derived = useMemo(() => getConfigDerived(config), [config]);
  const rounds = useMemo(() => generateOptimalRounds(seed, config), [seed, config]);
  const stats = useMemo(() => calculateRepetitionStats(rounds), [rounds]);

  const handleShuffle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSeed(Math.floor(Math.random() * 10000));
      setIsAnimating(false);
    }, 500);
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  // Auto-play through rounds
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveRound((prev) => {
        if (prev === null) return 1;
        if (prev >= config.numRounds) {
          setIsPlaying(false);
          return null;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, config.numRounds]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setActiveRound(null);
    } else {
      setIsPlaying(true);
      setActiveRound(1);
    }
  };

  const handleReset = () => {
    setSeed(42);
    setConfig(DEFAULT_CONFIG);
    setActiveRound(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                <span className="text-gradient">Unit Shuffle Algorithm</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {config.totalUnits} units → {config.numGroups} groups × {config.numRounds} rounds • Minimized repetition
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                disabled={isAnimating}
                className="gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Re-shuffle
              </Button>
              <Button
                variant={isPlaying ? "destructive" : "default"}
                size="sm"
                onClick={togglePlay}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Simulate
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Config Panel */}
        <div className="mb-8">
          <ConfigPanel config={config} onConfigChange={setConfig} />
        </div>

        {/* Info Banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold font-mono text-primary">{config.totalUnits}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">{config.numGroups}</div>
              <div className="text-sm text-muted-foreground">Groups ({derived.unitsPerGroup} units each)</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">{config.numRounds}</div>
              <div className="text-sm text-muted-foreground">Rounds ({config.minutesPerRound} min each)</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">{formatDuration(derived.totalDuration)}</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </div>

        {/* Stats & Lookup */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <StatsPanel stats={stats} />
          <UnitLookup rounds={rounds} config={config} />
        </div>

        {/* Legend */}
        <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Legend:</span>
          <div className="flex items-center gap-2">
            <span className="unit-badge unit-fixed">1</span>
            <span className="text-sm text-muted-foreground">Fixed unit (1-{derived.fixedUnits})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="unit-badge unit-variable">{derived.fixedUnits + 1}</span>
            <span className="text-sm text-muted-foreground">Variable unit ({derived.fixedUnits + 1}-{config.totalUnits})</span>
          </div>
        </div>

        {/* Rounds */}
        <div className="space-y-6">
          {rounds.map((round) => (
            <RoundDisplay
              key={round.roundNumber}
              round={round}
              isActive={activeRound === round.roundNumber}
              isAnimating={isAnimating}
              config={config}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Algorithm uses a greedy optimization approach to minimize pair repetitions.
            <br />
            Seed: <span className="font-mono">{seed}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
