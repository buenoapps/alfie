import type { Language } from '@/constants/letters';
import { TileColors } from '@/constants/theme';

export type WordEntry = {
  id: string;
  word: string;
  emoji: string;
  color: string;
};

const EN_WORDS: { word: string; emoji: string }[] = [
  { word: 'Mum', emoji: '👩' },
  { word: 'Dad', emoji: '👨' },
  { word: 'Sun', emoji: '☀️' },
  { word: 'Cat', emoji: '🐱' },
  { word: 'Dog', emoji: '🐶' },
  { word: 'Cup', emoji: '☕' },
  { word: 'Bus', emoji: '🚌' },
  { word: 'Egg', emoji: '🥚' },
  { word: 'Bed', emoji: '🛏️' },
  { word: 'Car', emoji: '🚗' },
  { word: 'Hat', emoji: '🎩' },
  { word: 'Pig', emoji: '🐷' },
  { word: 'Cow', emoji: '🐄' },
  { word: 'Duck', emoji: '🦆' },
];

const DE_WORDS: { word: string; emoji: string }[] = [
  { word: 'Mama', emoji: '👩' },
  { word: 'Papa', emoji: '👨' },
  { word: 'Kaka', emoji: '💩' },
  { word: 'Bus', emoji: '🚌' },
  { word: 'Auto', emoji: '🚗' },
  { word: 'Ente', emoji: '🦆' },
  { word: 'Oma', emoji: '👵' },
  { word: 'Opa', emoji: '👴' },
  { word: 'Tee', emoji: '🍵' },
  { word: 'Eis', emoji: '🍦' },
  { word: 'Kuh', emoji: '🐄' },
  { word: 'Hund', emoji: '🐶' },
  { word: 'Bett', emoji: '🛏️' },
  { word: 'Hut', emoji: '🎩' },
];

function build(list: { word: string; emoji: string }[]): WordEntry[] {
  return list.map((entry, index) => ({
    id: entry.word.toLowerCase(),
    word: entry.word,
    emoji: entry.emoji,
    color: TileColors[index % TileColors.length],
  }));
}

const WORDS: Record<Language, WordEntry[]> = {
  en: build(EN_WORDS),
  de: build(DE_WORDS),
};

export function getWords(lang: Language): WordEntry[] {
  return WORDS[lang];
}

export function getWord(lang: Language, id: string | undefined): WordEntry | undefined {
  if (!id) return undefined;
  const lower = id.toLowerCase();
  return WORDS[lang].find((w) => w.id === lower);
}

export function getWordIndex(lang: Language, id: string): number {
  const lower = id.toLowerCase();
  return WORDS[lang].findIndex((w) => w.id === lower);
}
