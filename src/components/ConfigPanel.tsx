import { ShuffleConfig, getConfigDerived } from "@/lib/shuffleAlgorithm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Users, Layers, Clock, Timer } from "lucide-react";

interface ConfigPanelProps {
  config: ShuffleConfig;
  onConfigChange: (config: ShuffleConfig) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const derived = getConfigDerived(config);

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  const handleChange = (field: keyof ShuffleConfig, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onConfigChange({ ...config, [field]: numValue });
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        Configuration
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Units */}
        <div className="space-y-2">
          <Label htmlFor="totalUnits" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            Total Units
          </Label>
          <Input
            id="totalUnits"
            type="number"
            min={1}
            value={config.totalUnits}
            onChange={(e) => handleChange("totalUnits", e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Number of Groups */}
        <div className="space-y-2">
          <Label htmlFor="numGroups" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            Groups
          </Label>
          <Input
            id="numGroups"
            type="number"
            min={1}
            max={config.totalUnits}
            value={config.numGroups}
            onChange={(e) => handleChange("numGroups", e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {derived.unitsPerGroup} units each
          </p>
        </div>

        {/* Number of Rounds */}
        <div className="space-y-2">
          <Label htmlFor="numRounds" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Rounds
          </Label>
          <Input
            id="numRounds"
            type="number"
            min={1}
            value={config.numRounds}
            onChange={(e) => handleChange("numRounds", e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {config.minutesPerRound} min each
          </p>
        </div>

        {/* Minutes per Round */}
        <div className="space-y-2">
          <Label htmlFor="minutesPerRound" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            Min/Round
          </Label>
          <Input
            id="minutesPerRound"
            type="number"
            min={1}
            value={config.minutesPerRound}
            onChange={(e) => handleChange("minutesPerRound", e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Total: {formatDuration(derived.totalDuration)}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Fixed units:</span>
            <span className="font-mono font-medium">1-{derived.fixedUnits}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Variable units:</span>
            <span className="font-mono font-medium">{derived.fixedUnits + 1}-{config.totalUnits}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total duration:</span>
            <span className="font-mono font-medium text-primary">{formatDuration(derived.totalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
