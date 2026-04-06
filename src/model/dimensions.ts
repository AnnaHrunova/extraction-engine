import type { FlavorDimensionDefinition } from "../types/domain";

export const flavorDimensions: FlavorDimensionDefinition[] = [
  {
    id: "acidity",
    label: "Кислотность",
    shortLabel: "A",
    color: "#5bc0eb",
    maxExtractable: 0.94,
    sensoryWeight: 1.08,
    curve: {
      kind: "early-exp",
      baseRate: 0.125,
      alpha: 5.4,
    },
  },
  {
    id: "sweetness",
    label: "Сладость",
    shortLabel: "S",
    color: "#ffd166",
    maxExtractable: 1.08,
    sensoryWeight: 1,
    curve: {
      kind: "mid-gaussian",
      baseRate: 0.14,
      mu: 0.48,
      sigma: 0.09,
    },
  },
  {
    id: "bitterness",
    label: "Горечь",
    shortLabel: "B",
    color: "#ef476f",
    maxExtractable: 1.22,
    sensoryWeight: 0.96,
    curve: {
      kind: "late-rise",
      baseRate: 0.028,
      beta: 6.1,
      exponent: 1.28,
    },
  },
];
