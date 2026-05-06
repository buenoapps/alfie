import { Platform } from 'react-native';

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
};

const themeColors = {
  text: Palette.ink,
  textSoft: Palette.inkSoft,
  background: Palette.cream,
  tint: Palette.honeyDark,
  icon: Palette.inkSoft,
  tabIconDefault: Palette.inkSoft,
  tabIconSelected: Palette.honeyDark,
};

export const Colors = {
  light: themeColors,
  dark: themeColors,
};

export const TileColors = [
  '#FFD86B',
  '#FFB4A8',
  '#BEE3F8',
  '#C4E8C2',
  '#FFC9DE',
  '#D7C4F5',
];

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
