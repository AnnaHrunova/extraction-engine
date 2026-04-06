import type {
  BrewParameters,
  ExtractionDerivative,
  ExtractionState,
  SolverId,
} from "../types/domain";

export type DerivativeFunction = (
  state: ExtractionState,
  timeSec: number,
  parameters: BrewParameters,
) => ExtractionDerivative;

export interface Solver {
  id: SolverId;
  label: string;
  step: (
    derivative: DerivativeFunction,
    state: ExtractionState,
    timeSec: number,
    dtSec: number,
    parameters: BrewParameters,
  ) => ExtractionState;
}
