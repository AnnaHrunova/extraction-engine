import { flavorDimensions } from "../model/dimensions";
import type { ExtractionState, FlavorProfile } from "../types/domain";
import { average, clamp } from "../utils/math";

const sensoryScaleReferenceMl = 38;

export const buildFlavorProfile = (
  finalState: ExtractionState,
  totalVolumeMl: number,
): FlavorProfile => {
  const intensities = Object.fromEntries(
    flavorDimensions.map((dimension) => {
      const intensity = clamp(
        (finalState.dimensions[dimension.id] * sensoryScaleReferenceMl * dimension.sensoryWeight) /
          Math.max(totalVolumeMl, 1),
        0,
        1.35,
      );

      return [dimension.id, intensity];
    }),
  ) as FlavorProfile["intensities"];

  const dominantDimension = flavorDimensions.reduce((dominant, dimension) =>
    intensities[dimension.id] > intensities[dominant.id] ? dimension : dominant,
  ).id;

  return {
    intensities,
    totalIntensity: average(Object.values(intensities)),
    dominantDimension,
  };
};
