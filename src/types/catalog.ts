export type CoffeeCategoryId = "black" | "milk" | "extras";
export type CoffeeMetricId = "strength" | "bitterness" | "acidity" | "sweetness" | "body";

export interface CoffeeCategory {
  id: CoffeeCategoryId;
  order: number;
  label: string;
  shortLabel: string;
  description: string;
}

export interface CoffeeLayer {
  id: string;
  label: string;
  amountPercent: number;
  color: string;
}

export interface CoffeeDrink {
  id: string;
  name: string;
  categoryId: CoffeeCategoryId;
  subtitle: string;
  volumeMl: number;
  baseLabel: string;
  tags: string[];
  description: string;
  brewingMethod: string;
  preparationSteps: string[];
  servingNote: string;
  layers: CoffeeLayer[];
  metrics: Record<CoffeeMetricId, number>;
}
