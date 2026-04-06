import type { SolverRun } from "../types/domain";
import { Section } from "./Section";

interface DiagnosisPanelProps {
  run: SolverRun;
}

export const DiagnosisPanel = ({ run }: DiagnosisPanelProps) => (
  <Section title="Диагноз" eyebrow="Интерпретация профиля">
    <div className={`diagnosis diagnosis--${run.diagnosis.code}`}>
      <div>
        <span className="diagnosis__label">{run.diagnosis.label}</span>
        <p>{run.diagnosis.summary}</p>
      </div>
      <p className="diagnosis__detail">{run.diagnosis.detail}</p>
    </div>
  </Section>
);
