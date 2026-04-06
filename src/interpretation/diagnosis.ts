import type { DiagnosisResult, FlavorProfile } from "../types/domain";

export const diagnoseExtraction = (profile: FlavorProfile): DiagnosisResult => {
  const acidity = profile.intensities.acidity;
  const sweetness = profile.intensities.sweetness;
  const bitterness = profile.intensities.bitterness;

  if (
    acidity >= bitterness * 1.25 &&
    sweetness <= 0.78 &&
    profile.totalIntensity < 0.7
  ) {
    return {
      code: "under",
      label: "Недоэкстракция",
      summary: "Ранняя фаза доминирует, сладость не успела полноценно собраться, а поздняя экстракция осталась слабой.",
      detail:
        "Обычно помогает более тонкий помол, чуть большая температура или более длинный пролив.",
    };
  }

  if (
    (bitterness >= sweetness * 0.94 && bitterness - acidity > 0.06) ||
    profile.totalIntensity > 0.92
  ) {
    return {
      code: "over",
      label: "Переэкстракция",
      summary: "Поздняя экстракция уже заметно тянет чашку в сухость и горький хвост.",
      detail:
        "Сократите время, ослабьте извлечение или уберите избыточный контакт воды с мелкими частицами.",
    };
  }

  return {
    code: "balanced",
    label: "Баланс",
    summary: "Сладость удерживает центр, а кислотность и горечь остаются в управляемых границах.",
    detail:
      "Это режим, где экстракция даёт читаемую структуру без провала в кислый или жжёно-сухой край.",
  };
};
