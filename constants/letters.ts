import { TileColors } from '@/constants/theme';

export type LetterEntry = {
  letter: string;
  word: string;
  emoji: string;
  color: string;
};

const LETTER_WORDS: { letter: string; word: string; emoji: string }[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', word: 'Bee', emoji: '🐝' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Egg', emoji: '🥚' },
  { letter: 'F', word: 'Frog', emoji: '🐸' },
  { letter: 'G', word: 'Grapes', emoji: '🍇' },
  { letter: 'H', word: 'Hat', emoji: '🎩' },
  { letter: 'I', word: 'Ice cream', emoji: '🍦' },
  { letter: 'J', word: 'Jellyfish', emoji: '🪼' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Moon', emoji: '🌙' },
  { letter: 'N', word: 'Nest', emoji: '🪺' },
  { letter: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', word: 'Penguin', emoji: '🐧' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Turtle', emoji: '🐢' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Volcano', emoji: '🌋' },
  { letter: 'W', word: 'Whale', emoji: '🐳' },
  { letter: 'X', word: 'Xylophone', emoji: '🎶' },
  { letter: 'Y', word: 'Yo-yo', emoji: '🪀' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

export const LETTERS: LetterEntry[] = LETTER_WORDS.map((entry, index) => ({
  ...entry,
  color: TileColors[index % TileColors.length],
}));

export function getLetter(id: string | undefined): LetterEntry | undefined {
  if (!id) return undefined;
  const upper = id.toUpperCase();
  return LETTERS.find((l) => l.letter === upper);
}

export function getLetterIndex(letter: string): number {
  return LETTERS.findIndex((l) => l.letter === letter.toUpperCase());
}
