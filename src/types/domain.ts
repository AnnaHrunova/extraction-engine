export type DrinkType = "espresso" | "americano" | "lungo";
export type SolverId = "euler" | "rk4";
export type SolverMode = SolverId | "both";
export type FlavorDimensionId = "acidity" | "sweetness" | "bitterness";
export type ExtractionCurveKind = "early-exp" | "mid-gaussian" | "late-rise";
export type ExtractionPhaseId = "early" | "mid" | "late";

export interface ExtractionCurveProfile {
  kind: ExtractionCurveKind;
  baseRate: number;
  alpha?: number;
  mu?: number;
  sigma?: number;
  beta?: number;
  exponent?: number;
}

export interface FlavorDimensionDefinition {
  id: FlavorDimensionId;
  label: string;
  shortLabel: string;
  color: string;
  maxExtractable: number;
  sensoryWeight: number;
  curve: ExtractionCurveProfile;
}

export interface ExtractionPhase {
  id: ExtractionPhaseId;
  label: string;
  description: string;
  startRatio: number;
  endRatio: number;
  color: string;
}

export interface DrinkProfile {
  id: DrinkType;
  label: string;
  description: string;
  baseYieldMl: number;
  referenceBrewTimeSec: number;
  dilutionDefaultMl: number;
  phases: ExtractionPhase[];
}

export interface BrewParameters {
  drinkType: DrinkType;
  grindSize: number;
  temperatureC: number;
  pressureBar: number;
  brewTimeSec: number;
  dtSec: number;
  dilutionMl: number;
  solverMode: SolverMode;
}

export interface ExtractionState {
  dimensions: Record<FlavorDimensionId, number>;
  volumeMl: number;
}

export interface ExtractionDerivative {
  dimensions: Record<FlavorDimensionId, number>;
  volumeMl: number;
}

export interface ExtractionSnapshot {
  timeSec: number;
  state: ExtractionState;
}

export interface FlavorProfile {
  intensities: Record<FlavorDimensionId, number>;
  totalIntensity: number;
  dominantDimension: FlavorDimensionId;
}

export interface DiagnosisResult {
  code: "under" | "balanced" | "over";
  label: string;
  summary: string;
  detail: string;
}

export interface SolverRun {
  solverId: SolverId;
  solverLabel: string;
  drink: DrinkProfile;
  snapshots: ExtractionSnapshot[];
  finalState: ExtractionState;
  extractionVolumeMl: number;
  dilutionMl: number;
  totalVolumeMl: number;
  finalProfile: FlavorProfile;
  diagnosis: DiagnosisResult;
}

export interface DimensionDeviation {
  finalDelta: number;
  maxDelta: number;
}

export interface SolverComparison {
  dimensions: Record<FlavorDimensionId, DimensionDeviation>;
  volume: DimensionDeviation;
  explanation: string;
}

export interface SimulationPreset {
  id: string;
  label: string;
  description: string;
  parameters: BrewParameters;
}

export interface EducationCard {
  title: string;
  body: string;
}
