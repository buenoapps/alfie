import { TileColors } from '@/constants/theme';

export type Language = 'en' | 'de';

export type LocalizedWord = {
  word: string;
  emoji: string;
};

export type LetterEntry = {
  letter: string;
  color: string;
  translations: Record<Language, LocalizedWord>;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const EN: Record<string, LocalizedWord> = {
  A: { word: 'Apple', emoji: '🍎' },
  B: { word: 'Bee', emoji: '🐝' },
  C: { word: 'Cat', emoji: '🐱' },
  D: { word: 'Dog', emoji: '🐶' },
  E: { word: 'Egg', emoji: '🥚' },
  F: { word: 'Frog', emoji: '🐸' },
  G: { word: 'Grapes', emoji: '🍇' },
  H: { word: 'Hat', emoji: '🎩' },
  I: { word: 'Ice cream', emoji: '🍦' },
  J: { word: 'Jellyfish', emoji: '🪼' },
  K: { word: 'Kite', emoji: '🪁' },
  L: { word: 'Lion', emoji: '🦁' },
  M: { word: 'Moon', emoji: '🌙' },
  N: { word: 'Nest', emoji: '🪺' },
  O: { word: 'Orange', emoji: '🍊' },
  P: { word: 'Penguin', emoji: '🐧' },
  Q: { word: 'Queen', emoji: '👑' },
  R: { word: 'Rainbow', emoji: '🌈' },
  S: { word: 'Sun', emoji: '☀️' },
  T: { word: 'Turtle', emoji: '🐢' },
  U: { word: 'Umbrella', emoji: '☂️' },
  V: { word: 'Volcano', emoji: '🌋' },
  W: { word: 'Whale', emoji: '🐳' },
  X: { word: 'Xylophone', emoji: '🎶' },
  Y: { word: 'Yo-yo', emoji: '🪀' },
  Z: { word: 'Zebra', emoji: '🦓' },
};

const DE: Record<string, LocalizedWord> = {
  A: { word: 'Apfel', emoji: '🍎' },
  B: { word: 'Biene', emoji: '🐝' },
  C: { word: 'Clown', emoji: '🤡' },
  D: { word: 'Drache', emoji: '🐉' },
  E: { word: 'Elefant', emoji: '🐘' },
  F: { word: 'Frosch', emoji: '🐸' },
  G: { word: 'Giraffe', emoji: '🦒' },
  H: { word: 'Hund', emoji: '🐶' },
  I: { word: 'Igel', emoji: '🦔' },
  J: { word: 'Jaguar', emoji: '🐆' },
  K: { word: 'Katze', emoji: '🐱' },
  L: { word: 'Löwe', emoji: '🦁' },
  M: { word: 'Mond', emoji: '🌙' },
  N: { word: 'Nest', emoji: '🪺' },
  O: { word: 'Orange', emoji: '🍊' },
  P: { word: 'Pinguin', emoji: '🐧' },
  Q: { word: 'Qualle', emoji: '🪼' },
  R: { word: 'Regenbogen', emoji: '🌈' },
  S: { word: 'Sonne', emoji: '☀️' },
  T: { word: 'Tiger', emoji: '🐅' },
  U: { word: 'Uhr', emoji: '⏰' },
  V: { word: 'Vogel', emoji: '🐦' },
  W: { word: 'Wal', emoji: '🐳' },
  X: { word: 'Xylophon', emoji: '🎶' },
  Y: { word: 'Yacht', emoji: '🛥️' },
  Z: { word: 'Zebra', emoji: '🦓' },
};

export const LETTERS: LetterEntry[] = ALPHABET.map((letter, index) => ({
  letter,
  color: TileColors[index % TileColors.length],
  translations: {
    en: EN[letter],
    de: DE[letter],
  },
}));

export function getLetter(id: string | undefined): LetterEntry | undefined {
  if (!id) return undefined;
  const upper = id.toUpperCase();
  return LETTERS.find((l) => l.letter === upper);
}

export function getLetterIndex(letter: string): number {
  return LETTERS.findIndex((l) => l.letter === letter.toUpperCase());
}

export function localized(entry: LetterEntry, lang: Language): LocalizedWord {
  return entry.translations[lang];
}
