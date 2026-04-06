import type { Solver } from "./types";
import { addScaledDerivative } from "./stateMath";

export const eulerSolver: Solver = {
  id: "euler",
  label: "Euler",
  step(derivative, state, timeSec, dtSec, parameters) {
    const k1 = derivative(state, timeSec, parameters);
    return addScaledDerivative(state, k1, dtSec);
  },
};
