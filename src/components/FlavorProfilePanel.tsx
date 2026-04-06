import { flavorDimensions } from "../model/dimensions";
import type { SolverRun } from "../types/domain";
import { formatMl, formatNumber } from "../utils/format";
import { Section } from "./Section";

interface FlavorProfilePanelProps {
  primaryRun: SolverRun;
  secondaryRun: SolverRun | null;
}

export const FlavorProfilePanel = ({
  primaryRun,
  secondaryRun,
}: FlavorProfilePanelProps) => (
  <Section
    title="Финальный вкусовой профиль"
    eyebrow="Итог по чашке"
    aside={<span className="badge">{primaryRun.solverLabel} как основной просмотр</span>}
  >
    <div className="profile-layout">
      <div className="profile-bars">
        {flavorDimensions.map((dimension) => {
          const primary = primaryRun.finalProfile.intensities[dimension.id] * 100;
          const secondary = secondaryRun
            ? secondaryRun.finalProfile.intensities[dimension.id] * 100
            : null;

          return (
            <article key={dimension.id} className="profile-bar">
              <header>
                <span>{dimension.label}</span>
                <strong>{formatNumber(primary, 1)}</strong>
              </header>
              <div className="profile-bar__track">
                <div
                  className="profile-bar__fill"
                  style={{
                    width: `${Math.min(primary, 100)}%`,
                    background: dimension.color,
                  }}
                />
                {secondary !== null ? (
                  <div
                    className="profile-bar__marker"
                    style={{
                      left: `${Math.min(secondary, 100)}%`,
                      borderColor: dimension.color,
                    }}
                  />
                ) : null}
              </div>
              <p>
                {secondary !== null
                  ? `Маркер показывает ${secondaryRun?.solverLabel}: ${formatNumber(secondary, 1)}`
                  : "Оценка в сенсорных баллах после учёта финального объёма."}
              </p>
            </article>
          );
        })}
      </div>
      <div className="profile-summary">
        <div className="stat-tile">
          <span>Финальный объём</span>
          <strong>{formatMl(primaryRun.totalVolumeMl)}</strong>
        </div>
        <div className="stat-tile">
          <span>Чистая экстракция</span>
          <strong>{formatMl(primaryRun.extractionVolumeMl)}</strong>
        </div>
        {primaryRun.dilutionMl > 0 ? (
          <div className="stat-tile">
            <span>Пост-дилюция</span>
            <strong>{formatMl(primaryRun.dilutionMl)}</strong>
          </div>
        ) : null}
        <div className="stat-tile">
          <span>Доминирующая ось</span>
          <strong>
            {flavorDimensions.find(
              (dimension) => dimension.id === primaryRun.finalProfile.dominantDimension,
            )?.label ?? ""}
          </strong>
        </div>
      </div>
    </div>
  </Section>
);
