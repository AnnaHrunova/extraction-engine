export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const clamp01 = (value: number): number => clamp(value, 0, 1);

export const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;
