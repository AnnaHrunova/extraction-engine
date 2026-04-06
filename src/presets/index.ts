import type { BrewParameters, SimulationPreset } from "../types/domain";

export const defaultParameters: BrewParameters = {
  drinkType: "espresso",
  grindSize: 42,
  temperatureC: 93,
  pressureBar: 9,
  brewTimeSec: 28,
  dtSec: 0.15,
  dilutionMl: 110,
  solverMode: "both",
};

export const presets: SimulationPreset[] = [
  {
    id: "balanced-espresso",
    label: "Сбалансированный эспрессо",
    description: "Базовый профиль с читаемой сладостью в центре.",
    parameters: {
      ...defaultParameters,
    },
  },
  {
    id: "under-shot",
    label: "Недоэкстрагированный шот",
    description: "Крупный помол, короткий пролив и ранняя кислотность.",
    parameters: {
      ...defaultParameters,
      grindSize: 74,
      temperatureC: 90,
      pressureBar: 8.1,
      brewTimeSec: 20,
      dtSec: 0.2,
    },
  },
  {
    id: "over-lungo",
    label: "Переэкстрагированный лунго",
    description: "Длинный пролив и поздняя горечь.",
    parameters: {
      ...defaultParameters,
      drinkType: "lungo",
      grindSize: 24,
      temperatureC: 95.5,
      pressureBar: 9.4,
      brewTimeSec: 45,
      dtSec: 0.18,
      dilutionMl: 0,
    },
  },
  {
    id: "large-dt-demo",
    label: "Демонстрация нестабильности при большом dt",
    description: "Шаг времени специально увеличен, чтобы Euler начал заметно врать.",
    parameters: {
      ...defaultParameters,
      grindSize: 18,
      temperatureC: 95.5,
      pressureBar: 9.7,
      brewTimeSec: 38,
      dtSec: 1.35,
    },
  },
  {
    id: "fine-long-brew",
    label: "Тонкий помол + длинный пролив",
    description: "Агрессивное извлечение с ростом сладости и горечи.",
    parameters: {
      ...defaultParameters,
      grindSize: 12,
      temperatureC: 94.5,
      pressureBar: 9.2,
      brewTimeSec: 36,
      dtSec: 0.12,
    },
  },
];
