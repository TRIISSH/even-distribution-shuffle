import { useState } from "react";
import { RoundData, getUnitHistory, ShuffleConfig } from "@/lib/shuffleAlgorithm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface UnitLookupProps {
  rounds: RoundData[];
  config: ShuffleConfig;
}

export function UnitLookup({ rounds, config }: UnitLookupProps) {
  const [searchUnit, setSearchUnit] = useState("");
  const [history, setHistory] = useState<ReturnType<typeof getUnitHistory> | null>(null);

  const handleSearch = () => {
    const unit = parseInt(searchUnit, 10);
    if (unit >= 1 && unit <= config.totalUnits) {
      setHistory(getUnitHistory(unit, rounds));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Count unique partners
  const allPartners = new Set<number>();
  history?.forEach((h) => h.partners.forEach((p) => allPartners.add(p)));
  const isFixed = history && history.length > 0 && parseInt(searchUnit) <= config.numGroups;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Unit Lookup
      </h3>

      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          min={1}
          max={config.totalUnits}
          placeholder={`Enter unit (1-${config.totalUnits})`}
          value={searchUnit}
          onChange={(e) => setSearchUnit(e.target.value)}
          onKeyDown={handleKeyDown}
          className="font-mono"
        />
        <Button onClick={handleSearch} size="sm" className="px-4">
          Track
        </Button>
      </div>

      {history && history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={`unit-badge text-lg w-12 h-12 ${
                isFixed ? "unit-fixed" : "unit-variable"
              }`}
            >
              {searchUnit}
            </span>
            <div>
              <div className="font-semibold">Unit {searchUnit}</div>
              <div className="text-sm text-muted-foreground">
                {isFixed ? `Fixed to Group ${searchUnit}` : "Variable unit"}
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-2">
              Meets <span className="font-mono font-bold text-foreground">{allPartners.size}</span> unique units across {config.numRounds} rounds
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.round}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">
                    R{entry.round}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Group</span>
                      <span className="font-mono font-semibold">{entry.group}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {entry.partners.map((partner) => (
                        <span
                          key={partner}
                          className={`unit-badge text-xs ${
                            partner <= config.numGroups ? "unit-fixed" : "unit-variable"
                          }`}
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {history && history.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Unit not found in any group.
        </p>
      )}

      {!history && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Enter a unit number to see its journey across rounds.
        </p>
      )}
    </div>
  );
}
