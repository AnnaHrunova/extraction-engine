import { flavorDimensions } from "../model/dimensions";
import { buildFlavorProfile } from "./flavor";
import type {
  ExtractionSnapshot,
  SolverComparison,
  SolverRun,
} from "../types/domain";

const compareAtSnapshots = (
  leftSnapshots: ExtractionSnapshot[],
  rightSnapshots: ExtractionSnapshot[],
) =>
  leftSnapshots.map((leftSnapshot, index) => {
    const rightSnapshot = rightSnapshots[index] ?? rightSnapshots[rightSnapshots.length - 1];
    const leftProfile = buildFlavorProfile(leftSnapshot.state, leftSnapshot.state.volumeMl || 1);
    const rightProfile = buildFlavorProfile(rightSnapshot.state, rightSnapshot.state.volumeMl || 1);

    return {
      leftSnapshot,
      rightSnapshot,
      leftProfile,
      rightProfile,
    };
  });

export const compareSolverRuns = (eulerRun: SolverRun, rk4Run: SolverRun): SolverComparison => {
  const timeline = compareAtSnapshots(eulerRun.snapshots, rk4Run.snapshots);

  const dimensions = Object.fromEntries(
    flavorDimensions.map((dimension) => {
      const finalDelta = Math.abs(
        eulerRun.finalProfile.intensities[dimension.id] -
          rk4Run.finalProfile.intensities[dimension.id],
      );
      const maxDelta = timeline.reduce(
        (max, point) =>
          Math.max(
            max,
            Math.abs(
              point.leftProfile.intensities[dimension.id] -
                point.rightProfile.intensities[dimension.id],
            ),
          ),
        0,
      );

      return [dimension.id, { finalDelta, maxDelta }];
    }),
  ) as SolverComparison["dimensions"];

  const finalVolume = Math.abs(eulerRun.totalVolumeMl - rk4Run.totalVolumeMl);
  const maxVolume = timeline.reduce(
    (max, point) =>
      Math.max(max, Math.abs(point.leftSnapshot.state.volumeMl - point.rightSnapshot.state.volumeMl)),
    0,
  );

  return {
    dimensions,
    volume: {
      finalDelta: finalVolume,
      maxDelta: maxVolume,
    },
    explanation:
      "Euler берёт производную только в начале шага и потому грубо перескакивает через быстрые изменения. RK4 оценивает траекторию внутри шага несколько раз, поэтому лучше ловит узкий пик сладости и поздний рост горечи при крупном dt.",
  };
};
