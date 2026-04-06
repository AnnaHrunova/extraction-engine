import type { DrinkProfile } from "../types/domain";

const basePhases = [
  {
    id: "early" as const,
    label: "Ранняя",
    description: "Здесь быстрее всего выходят яркие кислые компоненты.",
    startRatio: 0,
    endRatio: 0.3,
    color: "rgba(91, 192, 235, 0.16)",
  },
  {
    id: "mid" as const,
    label: "Средняя",
    description: "Средняя зона чаще всего отвечает за сладость и баланс шота.",
    startRatio: 0.3,
    endRatio: 0.68,
    color: "rgba(255, 209, 102, 0.16)",
  },
  {
    id: "late" as const,
    label: "Поздняя",
    description: "Чем дольше идём дальше, тем заметнее сухость и горечь.",
    startRatio: 0.68,
    endRatio: 1,
    color: "rgba(239, 71, 111, 0.16)",
  },
];

export const drinkProfiles: Record<DrinkProfile["id"], DrinkProfile> = {
  espresso: {
    id: "espresso",
    label: "Эспрессо",
    description: "Короткая концентрированная экстракция.",
    baseYieldMl: 38,
    referenceBrewTimeSec: 28,
    dilutionDefaultMl: 0,
    phases: basePhases,
  },
  americano: {
    id: "americano",
    label: "Американо",
    description: "Эспрессо плюс добавление воды после симуляции.",
    baseYieldMl: 38,
    referenceBrewTimeSec: 28,
    dilutionDefaultMl: 110,
    phases: basePhases,
  },
  lungo: {
    id: "lungo",
    label: "Лунго",
    description: "Длинный пролив и более высокий выход напитка.",
    baseYieldMl: 70,
    referenceBrewTimeSec: 40,
    dilutionDefaultMl: 0,
    phases: basePhases,
  },
};

export const getDrinkProfile = (drinkType: DrinkProfile["id"]): DrinkProfile =>
  drinkProfiles[drinkType];
