const generalFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const singleDigitFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatNumber = (value: number, digits = 2): string =>
  digits === 1 ? singleDigitFormatter.format(value) : generalFormatter.format(value);

export const formatMl = (value: number): string => `${formatNumber(value, 1)} мл`;
export const formatSeconds = (value: number): string => `${formatNumber(value, 1)} c`;
