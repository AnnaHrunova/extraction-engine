import { diagnoseExtraction } from "../interpretation/diagnosis";
import { buildFlavorProfile } from "../interpretation/flavor";
import { getDrinkProfile } from "../model/drinks";
import {
  clampState,
  createInitialState,
  extractionDerivative,
} from "../model/extractionModel";
import { solverRegistry } from "../solvers";
import type { BrewParameters, SolverMode, SolverRun } from "../types/domain";

const executeSolver = (
  parameters: BrewParameters,
  solverMode: Exclude<SolverMode, "both">,
): SolverRun => {
  const solver = solverRegistry[solverMode];
  const drink = getDrinkProfile(parameters.drinkType);
  const snapshots = [{ timeSec: 0, state: createInitialState() }];
  let state = createInitialState();
  let timeSec = 0;

  while (timeSec < parameters.brewTimeSec - 1e-9) {
    const stepSize = Math.min(parameters.dtSec, parameters.brewTimeSec - timeSec);
    state = clampState(
      solver.step(extractionDerivative, state, timeSec, stepSize, parameters),
    );
    timeSec += stepSize;
    snapshots.push({
      timeSec,
      state,
    });
  }

  const dilutionMl = parameters.drinkType === "americano" ? parameters.dilutionMl : 0;
  const totalVolumeMl = state.volumeMl + dilutionMl;
  const finalProfile = buildFlavorProfile(state, totalVolumeMl);

  return {
    solverId: solver.id,
    solverLabel: solver.label,
    drink,
    snapshots,
    finalState: state,
    extractionVolumeMl: state.volumeMl,
    dilutionMl,
    totalVolumeMl,
    finalProfile,
    diagnosis: diagnoseExtraction(finalProfile),
  };
};

export const runSimulation = (
  parameters: BrewParameters,
): Record<Exclude<SolverMode, "both">, SolverRun | null> => ({
  euler: parameters.solverMode === "rk4" ? null : executeSolver(parameters, "euler"),
  rk4: parameters.solverMode === "euler" ? null : executeSolver(parameters, "rk4"),
});
