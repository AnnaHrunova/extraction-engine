import type { Solver } from "./types";
import { addScaledDerivative, combineDerivatives } from "./stateMath";

export const rk4Solver: Solver = {
  id: "rk4",
  label: "RK4",
  step(derivative, state, timeSec, dtSec, parameters) {
    const halfStep = dtSec / 2;
    const k1 = derivative(state, timeSec, parameters);
    const k2 = derivative(
      addScaledDerivative(state, k1, halfStep),
      timeSec + halfStep,
      parameters,
    );
    const k3 = derivative(
      addScaledDerivative(state, k2, halfStep),
      timeSec + halfStep,
      parameters,
    );
    const k4 = derivative(addScaledDerivative(state, k3, dtSec), timeSec + dtSec, parameters);

    const blended = combineDerivatives([k1, k2, k3, k4], [1 / 6, 1 / 3, 1 / 3, 1 / 6]);
    return addScaledDerivative(state, blended, dtSec);
  },
};
