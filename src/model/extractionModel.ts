import { flavorDimensions } from "./dimensions";
import { getDrinkProfile } from "./drinks";
import type {
  BrewParameters,
  ExtractionDerivative,
  ExtractionState,
  FlavorDimensionDefinition,
} from "../types/domain";
import { clamp, clamp01 } from "../utils/math";

const gaussian = (value: number, mu: number, sigma: number): number =>
  Math.exp(-((value - mu) ** 2) / (2 * sigma ** 2));

const activationByCurve = (
  dimension: FlavorDimensionDefinition,
  normalizedTime: number,
): number => {
  switch (dimension.curve.kind) {
    case "early-exp":
      return Math.exp(-(dimension.curve.alpha ?? 0) * normalizedTime);
    case "mid-gaussian":
      return gaussian(
        normalizedTime,
        dimension.curve.mu ?? 0.5,
        dimension.curve.sigma ?? 0.12,
      );
    case "late-rise": {
      const beta = dimension.curve.beta ?? 4;
      const exponent = dimension.curve.exponent ?? 1;
      return 1 - Math.exp(-beta * normalizedTime ** exponent);
    }
  }
};

const buildDimensionRecord = (factory: (dimension: FlavorDimensionDefinition) => number) =>
  Object.fromEntries(
    flavorDimensions.map((dimension) => [dimension.id, factory(dimension)]),
  ) as ExtractionState["dimensions"];

const temperatureNorm = (temperatureC: number): number =>
  clamp01((temperatureC - 88) / 10);

const pressureNorm = (pressureBar: number): number =>
  clamp01((pressureBar - 6) / 4.5);

const coarsenessNorm = (grindSize: number): number => clamp01(grindSize / 100);

export const createInitialState = (): ExtractionState => ({
  dimensions: buildDimensionRecord(() => 0),
  volumeMl: 0,
});

export const clampState = (state: ExtractionState): ExtractionState => ({
  dimensions: buildDimensionRecord((dimension) =>
    clamp(state.dimensions[dimension.id], 0, dimension.maxExtractable),
  ),
  volumeMl: Math.max(state.volumeMl, 0),
});

export const extractionDerivative = (
  state: ExtractionState,
  timeSec: number,
  parameters: BrewParameters,
): ExtractionDerivative => {
  const drink = getDrinkProfile(parameters.drinkType);
  const normalizedTime = clamp01(timeSec / parameters.brewTimeSec);
  const normalizedBrewLength = clamp(
    (parameters.brewTimeSec - drink.referenceBrewTimeSec) / 18,
    -0.55,
    1.2,
  );
  const temp = temperatureNorm(parameters.temperatureC);
  const pressure = pressureNorm(parameters.pressureBar);
  const coarseness = coarsenessNorm(parameters.grindSize);
  const fineness = 1 - coarseness;

  const extractionDrive = clamp(
    0.76 + 0.48 * fineness + 0.17 * temp + 0.12 * pressure,
    0.55,
    1.55,
  );
  const channelingRisk = clamp01(0.58 * coarseness + 0.34 * pressure + 0.22 * temp - 0.56);
  const sweetnessRetention = clamp(
    1.08 - 0.34 * channelingRisk - 0.11 * Math.abs(temp - 0.58),
    0.62,
    1.14,
  );
  const bitternessBoost = clamp(
    0.45 +
      0.42 * fineness +
      0.28 * temp +
      0.32 * Math.max(normalizedBrewLength, 0) +
      0.1 * pressure,
    0.25,
    1.58,
  );
  const acidityBoost = clamp(
    0.97 + 0.13 * coarseness + 0.08 * (1 - temp) + 0.06 * pressure,
    0.75,
    1.18,
  );

  const dimensions = buildDimensionRecord((dimension) => {
    const activation = activationByCurve(dimension, normalizedTime);
    const saturation = Math.max(dimension.maxExtractable - state.dimensions[dimension.id], 0);

    let modifier = 1;
    if (dimension.id === "acidity") {
      modifier = acidityBoost;
    } else if (dimension.id === "sweetness") {
      modifier = sweetnessRetention * (0.96 + 0.12 * fineness + 0.08 * temp);
    } else if (dimension.id === "bitterness") {
      modifier = bitternessBoost * (1.02 + 0.16 * channelingRisk);
    }

    const rate = dimension.curve.baseRate * extractionDrive * modifier * activation;
    return rate * saturation;
  });

  const baseFlowRate = drink.baseYieldMl / drink.referenceBrewTimeSec;
  const flowShape = 0.64 + 1.28 * normalizedTime - 0.84 * normalizedTime ** 2;
  const pressureFlow = 0.88 + 0.22 * pressure;
  const grindFlow = 1.1 - 0.34 * fineness;
  const temperatureFlow = 0.94 + 0.08 * temp;
  const volumeMl = baseFlowRate * flowShape * pressureFlow * grindFlow * temperatureFlow;

  return {
    dimensions,
    volumeMl,
  };
};
