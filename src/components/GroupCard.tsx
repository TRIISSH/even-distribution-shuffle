import { GroupAssignment } from "@/lib/shuffleAlgorithm";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: GroupAssignment;
  isAnimating?: boolean;
}

const groupColors: Record<number, string> = {
  1: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
  2: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  3: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
  4: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  5: "from-rose-500/20 to-rose-600/10 border-rose-500/30",
  6: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  7: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  8: "from-lime-500/20 to-lime-600/10 border-lime-500/30",
  9: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  10: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
  11: "from-sky-500/20 to-sky-600/10 border-sky-500/30",
  12: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
  13: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  14: "from-red-500/20 to-red-600/10 border-red-500/30",
  15: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
};

const groupBadgeColors: Record<number, string> = {
  1: "bg-cyan-500 text-white",
  2: "bg-blue-500 text-white",
  3: "bg-violet-500 text-white",
  4: "bg-pink-500 text-white",
  5: "bg-rose-500 text-white",
  6: "bg-orange-500 text-white",
  7: "bg-amber-500 text-black",
  8: "bg-lime-500 text-black",
  9: "bg-emerald-500 text-white",
  10: "bg-teal-500 text-white",
  11: "bg-sky-500 text-white",
  12: "bg-indigo-500 text-white",
  13: "bg-purple-500 text-white",
  14: "bg-red-500 text-white",
  15: "bg-yellow-500 text-black",
};

export function GroupCard({ group, isAnimating }: GroupCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 bg-gradient-to-br transition-all duration-500",
        groupColors[group.groupId],
        isAnimating && "animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-lg",
            groupBadgeColors[group.groupId]
          )}
        >
          G{group.groupId}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          8 units
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
