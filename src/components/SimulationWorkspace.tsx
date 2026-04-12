import type { BrewParameters, SimulationPreset, SolverRun } from "../types/domain";
import { compareSolverRuns } from "../interpretation/comparison";
import { getDrinkProfile } from "../model/drinks";
import { runSimulation } from "../simulation/runSimulation";
import { ComparisonPanel } from "./ComparisonPanel";
import { ControlPanel } from "./ControlPanel";
import { DiagnosisPanel } from "./DiagnosisPanel";
import { EducationPanel } from "./EducationPanel";
import { FlavorProfilePanel } from "./FlavorProfilePanel";
import { PhaseStrip } from "./PhaseStrip";
import { Section } from "./Section";
import { TimeSeriesSection } from "./TimeSeriesSection";

const pickPrimaryRun = (
  eulerRun: SolverRun | null,
  rk4Run: SolverRun | null,
): SolverRun => rk4Run ?? eulerRun!;

interface SimulationWorkspaceProps {
  parameters: BrewParameters;
  onChange: (next: BrewParameters) => void;
  onPresetApply: (preset: SimulationPreset) => void;
}

export const SimulationWorkspace = ({
  parameters,
  onChange,
  onPresetApply,
}: SimulationWorkspaceProps) => {
  const simulation = runSimulation(parameters);
  const primaryRun = pickPrimaryRun(simulation.euler, simulation.rk4);
  const secondaryRun = parameters.solverMode === "both" ? simulation.euler : null;
  const comparison =
    simulation.euler && simulation.rk4 ? compareSolverRuns(simulation.euler, simulation.rk4) : null;
  const drink = getDrinkProfile(parameters.drinkType);

  return (
    <>
      <ControlPanel parameters={parameters} onChange={onChange} onPresetApply={onPresetApply} />

      <TimeSeriesSection
        eulerRun={simulation.euler}
        rk4Run={simulation.rk4}
        drink={drink}
        brewTimeSec={parameters.brewTimeSec}
      />

      <Section title="Фазы экстракции" eyebrow="Ранний / средний / поздний этап">
        <PhaseStrip drink={drink} brewTimeSec={parameters.brewTimeSec} />
      </Section>

      <FlavorProfilePanel primaryRun={primaryRun} secondaryRun={secondaryRun} />

      <DiagnosisPanel run={primaryRun} />

      <ComparisonPanel comparison={comparison} />

      <EducationPanel />
    </>
  );
};
