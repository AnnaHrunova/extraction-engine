import { flavorDimensions } from "../model/dimensions";
import type { SolverComparison } from "../types/domain";
import { formatMl, formatNumber } from "../utils/format";
import { Section } from "./Section";

interface ComparisonPanelProps {
  comparison: SolverComparison | null;
}

export const ComparisonPanel = ({ comparison }: ComparisonPanelProps) => (
  <Section title="Сравнение методов" eyebrow="Euler vs RK4">
    {comparison ? (
      <div className="comparison-grid">
        {flavorDimensions.map((dimension) => (
          <article key={dimension.id} className="comparison-card">
            <strong>{dimension.label}</strong>
            <span>Финал: {formatNumber(comparison.dimensions[dimension.id].finalDelta * 100, 1)}</span>
            <span>
              Макс. отклонение: {formatNumber(comparison.dimensions[dimension.id].maxDelta * 100, 1)}
            </span>
          </article>
        ))}
        <article className="comparison-card">
          <strong>Объём</strong>
          <span>Финал: {formatMl(comparison.volume.finalDelta)}</span>
          <span>Макс. отклонение: {formatMl(comparison.volume.maxDelta)}</span>
        </article>
        <article className="comparison-card comparison-card--wide">
          <strong>Почему методы расходятся</strong>
          <p>{comparison.explanation}</p>
        </article>
      </div>
    ) : (
      <p className="muted-copy">
        Включите режим «Оба», чтобы увидеть финальные расхождения и максимальное отклонение по
        траектории.
      </p>
    )}
  </Section>
);
