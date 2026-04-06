import type { DrinkProfile } from "../types/domain";

interface PhaseStripProps {
  drink: DrinkProfile;
  brewTimeSec: number;
}

export const PhaseStrip = ({ drink, brewTimeSec }: PhaseStripProps) => (
  <div className="phase-strip">
    <div className="phase-strip__bar">
      {drink.phases.map((phase) => (
        <div
          key={phase.id}
          className="phase-strip__segment"
          style={{
            width: `${(phase.endRatio - phase.startRatio) * 100}%`,
            background: phase.color,
          }}
        >
          <span>{phase.label}</span>
          <strong>{`${Math.round(phase.startRatio * brewTimeSec)}-${Math.round(phase.endRatio * brewTimeSec)} c`}</strong>
        </div>
      ))}
    </div>
    <div className="phase-strip__notes">
      {drink.phases.map((phase) => (
        <article key={phase.id} className="phase-note">
          <strong>{phase.label}</strong>
          <p>{phase.description}</p>
        </article>
      ))}
    </div>
  </div>
);
