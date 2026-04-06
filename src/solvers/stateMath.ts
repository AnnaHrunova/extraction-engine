import { flavorDimensions } from "../model/dimensions";
import type { ExtractionDerivative, ExtractionState } from "../types/domain";

export const addScaledDerivative = (
  state: ExtractionState,
  derivative: ExtractionDerivative,
  scale: number,
): ExtractionState => ({
  dimensions: Object.fromEntries(
    flavorDimensions.map((dimension) => [
      dimension.id,
      state.dimensions[dimension.id] + derivative.dimensions[dimension.id] * scale,
    ]),
  ) as ExtractionState["dimensions"],
  volumeMl: state.volumeMl + derivative.volumeMl * scale,
});

export const combineDerivatives = (
  derivatives: readonly ExtractionDerivative[],
  weights: readonly number[],
): ExtractionDerivative => ({
  dimensions: Object.fromEntries(
    flavorDimensions.map((dimension) => [
      dimension.id,
      derivatives.reduce(
        (sum, derivative, index) => sum + derivative.dimensions[dimension.id] * weights[index],
        0,
      ),
    ]),
  ) as ExtractionState["dimensions"],
  volumeMl: derivatives.reduce(
    (sum, derivative, index) => sum + derivative.volumeMl * weights[index],
    0,
  ),
});
