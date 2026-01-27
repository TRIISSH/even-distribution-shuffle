// Algorithm for optimal unit distribution with minimal repetition
// Uses a modified balanced incomplete block design approach

export interface GroupAssignment {
  groupId: number;
  fixedUnit: number;
  variableUnits: number[];
}

export interface RoundData {
  roundNumber: number;
  groups: GroupAssignment[];
}

export interface RepetitionStats {
  totalPairs: number;
  uniquePairs: number;
  maxRepetitions: number;
  avgRepetitions: number;
  pairCounts: Map<string, number>;
}

export interface ShuffleConfig {
  totalUnits: number;
  numGroups: number;
  numRounds: number;
  minutesPerRound: number;
}

export const DEFAULT_CONFIG: ShuffleConfig = {
  totalUnits: 120,
  numGroups: 15,
  numRounds: 10,
  minutesPerRound: 12,
};

// Derived values from config
export function getConfigDerived(config: ShuffleConfig) {
  const unitsPerGroup = Math.floor(config.totalUnits / config.numGroups);
  const fixedUnits = config.numGroups; // Units 1-numGroups are fixed
  const variableUnits = config.totalUnits - fixedUnits;
  const variablePerGroup = unitsPerGroup - 1;
  const totalDuration = config.numRounds * config.minutesPerRound;
  
  return {
    unitsPerGroup,
    fixedUnits,
    variableUnits,
    variablePerGroup,
    totalDuration,
  };
}

// Create a pair key for tracking
function createPairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

// Fisher-Yates shuffle with seed for reproducibility
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;
  
  const random = () => {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    return currentSeed / 0x7fffffff;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// Greedy algorithm to minimize repetitions
export function generateOptimalRounds(seed: number = 42, config: ShuffleConfig = DEFAULT_CONFIG): RoundData[] {
  const derived = getConfigDerived(config);
  const rounds: RoundData[] = [];
  const pairCounts = new Map<string, number>();
  const variableUnits = Array.from({ length: derived.variableUnits }, (_, i) => i + config.numGroups + 1);

  for (let round = 0; round < config.numRounds; round++) {
    // Score-based assignment to minimize repetitions
    const assignment = assignWithMinimalRepetition(
      variableUnits,
      pairCounts,
      round,
      seed,
      config
    );

    const groups: GroupAssignment[] = [];
    
    for (let g = 0; g < config.numGroups; g++) {
      const groupUnits = assignment[g];
      const fixedUnit = g + 1;
      
      // Update pair counts for this group
      const allUnits = [fixedUnit, ...groupUnits];
      for (let i = 0; i < allUnits.length; i++) {
        for (let j = i + 1; j < allUnits.length; j++) {
          const key = createPairKey(allUnits[i], allUnits[j]);
          pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
        }
      }

      groups.push({
        groupId: g + 1,
        fixedUnit,
        variableUnits: groupUnits,
      });
    }

    rounds.push({
      roundNumber: round + 1,
      groups,
    });
  }

  return rounds;
}

function assignWithMinimalRepetition(
  variableUnits: number[],
  pairCounts: Map<string, number>,
  roundIndex: number,
  baseSeed: number,
  config: ShuffleConfig
): number[][] {
  const derived = getConfigDerived(config);
  const groups: number[][] = Array.from({ length: config.numGroups }, () => []);
  const shuffled = seededShuffle(variableUnits, baseSeed + roundIndex * 1000);
  
  // Use different rotation offsets for each round to spread units
  const offset = roundIndex * derived.variablePerGroup;
  
  for (let i = 0; i < shuffled.length; i++) {
    const unit = shuffled[i];
    
    // Find the group with the least "cost" (existing pairs with this unit)
    let bestGroup = -1;
    let bestCost = Infinity;
    
    // Try groups in a rotated order based on round
    for (let attempt = 0; attempt < config.numGroups; attempt++) {
      const g = (i + offset + attempt) % config.numGroups;
      
      if (groups[g].length >= derived.variablePerGroup) continue;
      
      // Calculate cost: sum of existing pair counts
      let cost = 0;
      const fixedUnit = g + 1;
      cost += pairCounts.get(createPairKey(unit, fixedUnit)) || 0;
      
      for (const existing of groups[g]) {
        cost += pairCounts.get(createPairKey(unit, existing)) || 0;
      }
      
      // Add slight penalty for unbalanced groups
      cost += groups[g].length * 0.1;
      
      if (cost < bestCost) {
        bestCost = cost;
        bestGroup = g;
      }
    }
    
    if (bestGroup !== -1) {
      groups[bestGroup].push(unit);
    }
  }

  return groups;
}

// Calculate repetition statistics
export function calculateRepetitionStats(rounds: RoundData[]): RepetitionStats {
  const pairCounts = new Map<string, number>();
  
  for (const round of rounds) {
    for (const group of round.groups) {
      const allUnits = [group.fixedUnit, ...group.variableUnits];
      for (let i = 0; i < allUnits.length; i++) {
        for (let j = i + 1; j < allUnits.length; j++) {
          const key = createPairKey(allUnits[i], allUnits[j]);
          pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
        }
      }
    }
  }

  const counts = Array.from(pairCounts.values());
  const totalPairs = counts.reduce((a, b) => a + b, 0);
  const uniquePairs = pairCounts.size;
  const maxRepetitions = Math.max(...counts, 0);
  const avgRepetitions = counts.length > 0 ? totalPairs / counts.length : 0;

  return {
    totalPairs,
    uniquePairs,
    maxRepetitions,
    avgRepetitions,
    pairCounts,
  };
}

// Get unit history across rounds
export function getUnitHistory(unit: number, rounds: RoundData[]): { round: number; group: number; partners: number[] }[] {
  const history: { round: number; group: number; partners: number[] }[] = [];
  
  for (const round of rounds) {
    for (const group of round.groups) {
      const allUnits = [group.fixedUnit, ...group.variableUnits];
      if (allUnits.includes(unit)) {
        history.push({
          round: round.roundNumber,
          group: group.groupId,
          partners: allUnits.filter(u => u !== unit),
        });
        break;
      }
    }
  }
  
  return history;
}
