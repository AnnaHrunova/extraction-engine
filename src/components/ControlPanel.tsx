import { getDrinkProfile } from "../model/drinks";
import { presets } from "../presets";
import type { BrewParameters, DrinkType, SimulationPreset, SolverMode } from "../types/domain";
import { formatNumber, formatSeconds } from "../utils/format";
import { Section } from "./Section";

interface ControlPanelProps {
  parameters: BrewParameters;
  onChange: (next: BrewParameters) => void;
  onPresetApply: (preset: SimulationPreset) => void;
}

const drinkOptions: Array<{ value: DrinkType; label: string }> = [
  { value: "espresso", label: "Эспрессо" },
  { value: "americano", label: "Американо" },
  { value: "lungo", label: "Лунго" },
];

const solverOptions: Array<{ value: SolverMode; label: string }> = [
  { value: "both", label: "Оба" },
  { value: "euler", label: "Euler" },
  { value: "rk4", label: "RK4" },
];

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueLabel: string;
  onChange: (value: number) => void;
  hint: string;
}

const SliderControl = ({
  label,
  min,
  max,
  step,
  value,
  valueLabel,
  onChange,
  hint,
}: SliderProps) => (
  <label className="control">
    <div className="control__header">
      <span>{label}</span>
      <strong>{valueLabel}</strong>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <span className="control__hint">{hint}</span>
  </label>
);

export const ControlPanel = ({ parameters, onChange, onPresetApply }: ControlPanelProps) => {
  const drink = getDrinkProfile(parameters.drinkType);

  const update = <Key extends keyof BrewParameters>(key: Key, value: BrewParameters[Key]) => {
    onChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <Section
      title="Панель управления"
      eyebrow="Сценарий экстракции"
      aside={<span className="badge badge--accent">{drink.description}</span>}
    >
      <div className="controls-layout">
        <div className="control-block">
          <span className="control-block__label">Напиток</span>
          <div className="segmented">
            {drinkOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === parameters.drinkType ? "is-active" : undefined}
                onClick={() =>
                  onChange({
                    ...parameters,
                    drinkType: option.value,
                    dilutionMl:
                      option.value === "americano"
                        ? parameters.dilutionMl || getDrinkProfile("americano").dilutionDefaultMl
                        : parameters.dilutionMl,
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-block">
          <span className="control-block__label">Численный метод</span>
          <div className="segmented">
            {solverOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === parameters.solverMode ? "is-active" : undefined}
                onClick={() => update("solverMode", option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="preset-grid">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-card"
              onClick={() => onPresetApply(preset)}
            >
              <strong>{preset.label}</strong>
              <span>{preset.description}</span>
            </button>
          ))}
        </div>

        <div className="slider-grid">
          <SliderControl
            label="Помол"
            min={0}
            max={100}
            step={1}
            value={parameters.grindSize}
            valueLabel={`${Math.round(parameters.grindSize)}`}
            onChange={(value) => update("grindSize", value)}
            hint="0 = очень тонкий, 100 = очень крупный"
          />
          <SliderControl
            label="Температура"
            min={88}
            max={98}
            step={0.1}
            value={parameters.temperatureC}
            valueLabel={`${formatNumber(parameters.temperatureC, 1)} °C`}
            onChange={(value) => update("temperatureC", value)}
            hint="Горячее ускоряет позднюю экстракцию"
          />
          <SliderControl
            label="Давление"
            min={6}
            max={10.5}
            step={0.1}
            value={parameters.pressureBar}
            valueLabel={`${formatNumber(parameters.pressureBar, 1)} бар`}
            onChange={(value) => update("pressureBar", value)}
            hint="Большее давление подталкивает поток и извлечение"
          />
          <SliderControl
            label="Время пролива"
            min={16}
            max={55}
            step={0.5}
            value={parameters.brewTimeSec}
            valueLabel={formatSeconds(parameters.brewTimeSec)}
            onChange={(value) => update("brewTimeSec", value)}
            hint="Длинный пролив чаще уводит профиль в горечь"
          />
          <SliderControl
            label="Шаг интегрирования dt"
            min={0.05}
            max={1.5}
            step={0.05}
            value={parameters.dtSec}
            valueLabel={formatSeconds(parameters.dtSec)}
            onChange={(value) => update("dtSec", value)}
            hint="Крупный шаг быстрее, но хуже ловит динамику"
          />
          {parameters.drinkType === "americano" ? (
            <SliderControl
              label="Дилюция"
              min={20}
              max={180}
              step={5}
              value={parameters.dilutionMl}
              valueLabel={`${formatNumber(parameters.dilutionMl, 1)} мл`}
              onChange={(value) => update("dilutionMl", value)}
              hint="Вода добавляется после расчёта экстракции"
            />
          ) : null}
        </div>
      </div>
    </Section>
  );
};
