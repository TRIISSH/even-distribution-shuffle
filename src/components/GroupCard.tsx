import { GroupAssignment, ShuffleConfig, getConfigDerived } from "@/lib/shuffleAlgorithm";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: GroupAssignment;
  isAnimating?: boolean;
  config: ShuffleConfig;
}

// Color palette that cycles for any number of groups
const colorPalette = [
  { card: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30", badge: "bg-cyan-500 text-white" },
  { card: "from-blue-500/20 to-blue-600/10 border-blue-500/30", badge: "bg-blue-500 text-white" },
  { card: "from-violet-500/20 to-violet-600/10 border-violet-500/30", badge: "bg-violet-500 text-white" },
  { card: "from-pink-500/20 to-pink-600/10 border-pink-500/30", badge: "bg-pink-500 text-white" },
  { card: "from-rose-500/20 to-rose-600/10 border-rose-500/30", badge: "bg-rose-500 text-white" },
  { card: "from-orange-500/20 to-orange-600/10 border-orange-500/30", badge: "bg-orange-500 text-white" },
  { card: "from-amber-500/20 to-amber-600/10 border-amber-500/30", badge: "bg-amber-500 text-black" },
  { card: "from-lime-500/20 to-lime-600/10 border-lime-500/30", badge: "bg-lime-500 text-black" },
  { card: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30", badge: "bg-emerald-500 text-white" },
  { card: "from-teal-500/20 to-teal-600/10 border-teal-500/30", badge: "bg-teal-500 text-white" },
  { card: "from-sky-500/20 to-sky-600/10 border-sky-500/30", badge: "bg-sky-500 text-white" },
  { card: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30", badge: "bg-indigo-500 text-white" },
  { card: "from-purple-500/20 to-purple-600/10 border-purple-500/30", badge: "bg-purple-500 text-white" },
  { card: "from-red-500/20 to-red-600/10 border-red-500/30", badge: "bg-red-500 text-white" },
  { card: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30", badge: "bg-yellow-500 text-black" },
];

export function GroupCard({ group, isAnimating, config }: GroupCardProps) {
  const derived = getConfigDerived(config);
  const colorIndex = (group.groupId - 1) % colorPalette.length;
  const colors = colorPalette[colorIndex];

  return (
    <div
      className={cn(
        "rounded-xl border p-3 bg-gradient-to-br transition-all duration-500",
        colors.card,
        isAnimating && "animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-lg",
            colors.badge
          )}
        >
          G{group.groupId}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {derived.unitsPerGroup} units
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {/* Fixed unit - highlighted */}
        <span className="unit-badge unit-fixed font-bold">
          {group.fixedUnit}
        </span>

        {/* Variable units */}
        {group.variableUnits.map((unit, idx) => (
          <span
            key={unit}
            className={cn(
              "unit-badge unit-variable",
              isAnimating && "animate-bounce"
            )}
            style={{
              animationDelay: isAnimating ? `${idx * 50}ms` : undefined,
            }}
          >
            {unit}
          </span>
        ))}
      </div>
    </div>
  );
}
