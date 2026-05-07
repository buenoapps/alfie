import { Colors, tint } from '@/constants/theme';

describe('Colors table', () => {
  it('exposes the same keys for light and dark modes', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(darkKeys).toEqual(lightKeys);
  });

  it('uses different background colors per mode', () => {
    expect(Colors.light.screen).not.toBe(Colors.dark.screen);
    expect(Colors.light.text).not.toBe(Colors.dark.text);
  });
});

describe('tint()', () => {
  it('lightens the input color in light mode', () => {
    const result = tint('#FFD86B', 'light');
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    expect(result.toLowerCase()).not.toBe('#ffd86b');
  });

  it('produces a darker result in dark mode than in light mode', () => {
    const lightOut = tint('#FFD86B', 'light');
    const darkOut = tint('#FFD86B', 'dark');
    const sum = (hex: string) =>
      parseInt(hex.slice(1, 3), 16) +
      parseInt(hex.slice(3, 5), 16) +
      parseInt(hex.slice(5, 7), 16);
    expect(sum(darkOut)).toBeLessThan(sum(lightOut));
  });

  it('returns the input unchanged for malformed hex', () => {
    expect(tint('not-a-color', 'light')).toBe('not-a-color');
  });
});
