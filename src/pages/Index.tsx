import { useState, useEffect, useMemo } from "react";
import {
  generateOptimalRounds,
  calculateRepetitionStats,
} from "@/lib/shuffleAlgorithm";
import { RoundDisplay } from "@/components/RoundDisplay";
import { StatsPanel } from "@/components/StatsPanel";
import { UnitLookup } from "@/components/UnitLookup";
import { Button } from "@/components/ui/button";
import { Shuffle, Play, Pause, RotateCcw, Zap } from "lucide-react";

const Index = () => {
  const [seed, setSeed] = useState(42);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const rounds = useMemo(() => generateOptimalRounds(seed), [seed]);
  const stats = useMemo(() => calculateRepetitionStats(rounds), [rounds]);

  const handleShuffle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSeed(Math.floor(Math.random() * 10000));
      setIsAnimating(false);
    }, 500);
  };

  // Auto-play through rounds
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveRound((prev) => {
        if (prev === null) return 1;
        if (prev >= 10) {
          setIsPlaying(false);
          return null;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setActiveRound(null);
    } else {
      setIsPlaying(true);
      setActiveRound(1);
    }
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
                120 units → 15 groups × 10 rounds • Minimized repetition
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
                onClick={() => {
                  setSeed(42);
                  setActiveRound(null);
                  setIsPlaying(false);
                }}
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
        {/* Info Banner */}
        <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold font-mono text-primary">120</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">15</div>
              <div className="text-sm text-muted-foreground">Groups (8 units each)</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">10</div>
              <div className="text-sm text-muted-foreground">Rounds (12 min each)</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono">2h</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </div>

        {/* Stats & Lookup */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <StatsPanel stats={stats} />
          <UnitLookup rounds={rounds} />
        </div>

        {/* Legend */}
        <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Legend:</span>
          <div className="flex items-center gap-2">
            <span className="unit-badge unit-fixed">1</span>
            <span className="text-sm text-muted-foreground">Fixed unit (1-15)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="unit-badge unit-variable">16</span>
            <span className="text-sm text-muted-foreground">Variable unit (16-120)</span>
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
