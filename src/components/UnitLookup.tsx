import { useState } from "react";
import { RoundData, getUnitHistory } from "@/lib/shuffleAlgorithm";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UnitLookupProps {
  rounds: RoundData[];
}

export function UnitLookup({ rounds }: UnitLookupProps) {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const num = parseInt(value);
    if (num >= 1 && num <= 120) {
      setSelectedUnit(num);
    } else {
      setSelectedUnit(null);
    }
  };

  const history = selectedUnit ? getUnitHistory(selectedUnit, rounds) : [];
  const isFixed = selectedUnit !== null && selectedUnit <= 15;

  // Count unique partners
  const allPartners = new Set<number>();
  history.forEach((h) => h.partners.forEach((p) => allPartners.add(p)));

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Unit Lookup
      </h3>

      <div className="relative mb-4">
        <Input
          type="number"
          min={1}
          max={120}
          placeholder="Enter unit number (1-120)"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 font-mono"
        />
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {selectedUnit && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className={`unit-badge text-lg w-12 h-12 ${
                isFixed ? "unit-fixed" : "unit-variable"
              }`}
            >
              {selectedUnit}
            </span>
            <div>
              <div className="font-semibold">Unit {selectedUnit}</div>
              <div className="text-sm text-muted-foreground">
                {isFixed ? "Fixed to Group " + selectedUnit : "Variable unit"}
              </div>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-2">
              Meets <span className="font-mono font-bold text-foreground">{allPartners.size}</span> unique units across 10 rounds
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.round}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-20 text-muted-foreground">
                    Round {h.round}
                  </span>
                  <span className="w-16 font-mono text-primary">
                    Group {h.group}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {h.partners.map((p) => (
                      <span
                        key={p}
                        className={`unit-badge w-6 h-6 text-[10px] ${
                          p <= 15 ? "unit-fixed" : "unit-variable"
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedUnit && searchValue && (
        <p className="text-sm text-muted-foreground">
          Enter a number between 1 and 120
        </p>
      )}
    </div>
  );
}
