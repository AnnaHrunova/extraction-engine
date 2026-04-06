import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { flavorDimensions } from "../model/dimensions";
import type { DrinkProfile, SolverRun } from "../types/domain";
import { formatNumber } from "../utils/format";
import { Section } from "./Section";

interface TimeSeriesSectionProps {
  eulerRun: SolverRun | null;
  rk4Run: SolverRun | null;
  drink: DrinkProfile;
  brewTimeSec: number;
}

interface ChartRow {
  timeSec: number;
  volumeEuler?: number;
  volumeRk4?: number;
  acidityEuler?: number;
  acidityRk4?: number;
  sweetnessEuler?: number;
  sweetnessRk4?: number;
  bitternessEuler?: number;
  bitternessRk4?: number;
}

const buildChartRows = (eulerRun: SolverRun | null, rk4Run: SolverRun | null): ChartRow[] => {
  const source = rk4Run?.snapshots ?? eulerRun?.snapshots ?? [];

  return source.map((snapshot, index) => {
    const eulerSnapshot = eulerRun?.snapshots[index];
    const rk4Snapshot = rk4Run?.snapshots[index];

    return {
      timeSec: snapshot.timeSec,
      acidityEuler: eulerSnapshot?.state.dimensions.acidity,
      acidityRk4: rk4Snapshot?.state.dimensions.acidity,
      sweetnessEuler: eulerSnapshot?.state.dimensions.sweetness,
      sweetnessRk4: rk4Snapshot?.state.dimensions.sweetness,
      bitternessEuler: eulerSnapshot?.state.dimensions.bitterness,
      bitternessRk4: rk4Snapshot?.state.dimensions.bitterness,
      volumeEuler: eulerSnapshot?.state.volumeMl,
      volumeRk4: rk4Snapshot?.state.volumeMl,
    };
  });
};

const renderChart = (
  rows: ChartRow[],
  drink: DrinkProfile,
  brewTimeSec: number,
  title: string,
  leftKey: keyof ChartRow,
  rightKey: keyof ChartRow,
  color: string,
  unit: string,
) => (
  <article className="chart-card">
    <header className="chart-card__header">
      <h3>{title}</h3>
      <span>{unit}</span>
    </header>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={rows}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        {drink.phases.map((phase) => (
          <ReferenceArea
            key={phase.id}
            x1={phase.startRatio * brewTimeSec}
            x2={phase.endRatio * brewTimeSec}
            fill={phase.color}
            strokeOpacity={0}
          />
        ))}
        <XAxis
          dataKey="timeSec"
          stroke="rgba(236, 239, 244, 0.55)"
          tickFormatter={(value) => `${Math.round(value)} c`}
        />
        <YAxis stroke="rgba(236, 239, 244, 0.55)" />
        <Tooltip
          formatter={(value) => {
            if (Array.isArray(value)) {
              return value.join(", ");
            }

            if (typeof value === "number") {
              return formatNumber(value, 2);
            }

            return value ?? "";
          }}
          labelFormatter={(value) => `t = ${formatNumber(Number(value), 1)} c`}
          contentStyle={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            background: "rgba(9, 13, 18, 0.96)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={rightKey}
          name="RK4"
          stroke={color}
          strokeWidth={2.4}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey={leftKey}
          name="Euler"
          stroke={color}
          strokeDasharray="7 5"
          strokeWidth={2.2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  </article>
);

export const TimeSeriesSection = ({
  eulerRun,
  rk4Run,
  drink,
  brewTimeSec,
}: TimeSeriesSectionProps) => {
  const rows = buildChartRows(eulerRun, rk4Run);

  return (
    <Section title="Временные ряды" eyebrow="Эволюция во времени">
      <div className="chart-grid">
        {flavorDimensions.map((dimension) =>
          renderChart(
            rows,
            drink,
            brewTimeSec,
            dimension.label,
            `${dimension.id}Euler` as keyof ChartRow,
            `${dimension.id}Rk4` as keyof ChartRow,
            dimension.color,
            "отн. ед.",
          ),
        )}
        {renderChart(
          rows,
          drink,
          brewTimeSec,
          "Объём",
          "volumeEuler",
          "volumeRk4",
          "#8d99ae",
          "мл",
        )}
      </div>
    </Section>
  );
};
