export const colors = {
  background: '#050608',
  backgroundSoft: '#0B0D10',
  surface: '#111419',
  surfaceMuted: '#181C22',
  border: '#252B33',
  text: '#F3F0E8',
  textMuted: '#A49D91',
  textFaint: '#6F766F',
  accent: '#A7C7C5',
  signal: '#B9A77C',
  black: '#000000',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 52,
} as const;

export const radii = {
  sm: 10,
  md: 18,
  lg: 28,
  pill: 999,
} as const;

export const typography = {
  eyebrow: 12,
  body: 16,
  bodyLarge: 18,
  title: 34,
  display: 48,
} as const;

export const motion = {
  quick: 180,
  measured: 320,
  atmospheric: 700,
} as const;
