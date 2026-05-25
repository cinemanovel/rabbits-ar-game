export const colors = {
  background: '#050608',
  backgroundInk: '#020304',
  backgroundSoft: '#0B0D10',
  veil: '#07090D',
  surface: '#101318',
  surfaceRaised: '#171B22',
  surfaceMuted: '#1C2028',
  surfaceGlow: '#202834',
  border: '#29303A',
  borderSoft: '#1B2028',
  text: '#F4F0E8',
  textMuted: '#B0A89B',
  textFaint: '#727A73',
  accent: '#9DBEBC',
  accentMuted: '#405E61',
  signal: '#B9A77C',
  signalMuted: '#615640',
  black: '#000000',
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 52,
  xxxl: 72,
} as const;

export const radii = {
  sm: 10,
  md: 18,
  lg: 28,
  pill: 999,
} as const;

export const typography = {
  micro: 10,
  caption: 11,
  eyebrow: 12,
  small: 14,
  body: 16,
  bodyLarge: 18,
  subtitle: 22,
  title: 34,
  display: 50,
} as const;

export const motion = {
  quick: 140,
  measured: 280,
  atmospheric: 560,
  slow: 900,
} as const;
