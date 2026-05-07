import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const Palette = {
  honey: '#FFC93C',
  honeyDark: '#E0A92A',
  sun: '#FFF4C2',
  cream: '#FFFBEA',
  sky: '#BEE3F8',
  blossom: '#FF8FB1',
  blossomDark: '#E76A93',
  leaf: '#7FD08F',
  ink: '#3A2E1F',
  inkSoft: '#6B5A3E',
  stripe: '#5A3A1B',
  white: '#FFFFFF',
  // Dark-mode-only neutrals.
  shadow: '#1A1610',
  shadowSoft: '#241D14',
};

const lightColors = {
  text: Palette.ink,
  textSoft: Palette.inkSoft,
  background: Palette.cream,
  screen: Palette.cream,
  tint: Palette.honeyDark,
  icon: Palette.inkSoft,
  tabIconDefault: Palette.inkSoft,
  tabIconSelected: Palette.honeyDark,
};

const darkColors = {
  text: '#FFF4D6',
  textSoft: '#C9B377',
  background: Palette.shadow,
  screen: Palette.shadow,
  tint: Palette.honey,
  icon: '#C9B377',
  tabIconDefault: '#C9B377',
  tabIconSelected: Palette.honey,
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

export type ColorScheme = keyof typeof Colors;

export function useTheme(): typeof Colors.light {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}

export const TileColors = [
  '#FFD86B',
  '#FFB4A8',
  '#BEE3F8',
  '#C4E8C2',
  '#FFC9DE',
  '#D7C4F5',
];

export function tint(hex: string, scheme: ColorScheme = 'light'): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return hex;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const base = scheme === 'dark' ? 0x1a : 0xff;
  const tileMix = scheme === 'dark' ? 0.25 : 0.45;
  const baseMix = 1 - tileMix;
  const mix = (c: number) => Math.round(c * tileMix + base * baseMix);
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
