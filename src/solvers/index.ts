import { eulerSolver } from "./euler";
import { rk4Solver } from "./rk4";
import type { Solver } from "./types";
import type { SolverId } from "../types/domain";

export const solverRegistry: Record<SolverId, Solver> = {
  euler: eulerSolver,
  rk4: rk4Solver,
};

export type { Solver } from "./types";
