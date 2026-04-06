import "./App.css";
import { useState } from "react";
import { ComparisonPanel } from "./components/ComparisonPanel";
import { ControlPanel } from "./components/ControlPanel";
import { DiagnosisPanel } from "./components/DiagnosisPanel";
import { EducationPanel } from "./components/EducationPanel";
import { FlavorProfilePanel } from "./components/FlavorProfilePanel";
import { PhaseStrip } from "./components/PhaseStrip";
import { Section } from "./components/Section";
import { TimeSeriesSection } from "./components/TimeSeriesSection";
import { compareSolverRuns } from "./interpretation/comparison";
import { getDrinkProfile } from "./model/drinks";
import { defaultParameters } from "./presets";
import { runSimulation } from "./simulation/runSimulation";
import type { BrewParameters, SimulationPreset, SolverRun } from "./types/domain";
import { formatSeconds } from "./utils/format";

const pickPrimaryRun = (
  eulerRun: SolverRun | null,
  rk4Run: SolverRun | null,
): SolverRun => rk4Run ?? eulerRun!;

function App() {
  const [parameters, setParameters] = useState<BrewParameters>(defaultParameters);
  const simulation = runSimulation(parameters);
  const primaryRun = pickPrimaryRun(simulation.euler, simulation.rk4);
  const secondaryRun = parameters.solverMode === "both" ? simulation.euler : null;
  const comparison =
    simulation.euler && simulation.rk4 ? compareSolverRuns(simulation.euler, simulation.rk4) : null;
  const drink = getDrinkProfile(parameters.drinkType);

  const handlePresetApply = (preset: SimulationPreset) => {
    setParameters(preset.parameters);
  };

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <main className="app">
        <header className="hero panel">
          <div className="hero__copy">
            <p className="hero__eyebrow">Coffee Extraction Engine</p>
            <h1>Численная модель экстракции кофе в браузере</h1>
            <p className="hero__lead">
              Один и тот же ODE-процесс решается двумя методами: Euler и RK4. Сравнивайте, как шаг
              интегрирования и параметры пролива меняют профиль чашки, объём и диагноз.
            </p>
          </div>
          <div className="hero__stats">
            <article className="hero-stat">
              <span>Напиток</span>
              <strong>{drink.label}</strong>
            </article>
            <article className="hero-stat">
              <span>Время пролива</span>
              <strong>{formatSeconds(parameters.brewTimeSec)}</strong>
            </article>
            <article className="hero-stat">
              <span>dt</span>
              <strong>{formatSeconds(parameters.dtSec)}</strong>
            </article>
          </div>
        </header>

        <ControlPanel
          parameters={parameters}
          onChange={setParameters}
          onPresetApply={handlePresetApply}
        />

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
      </main>
    </div>
  );
}

export default App;
