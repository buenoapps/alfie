import { LETTERS, getLetter, getLetterIndex, localized } from '@/constants/letters';

describe('LETTERS dataset', () => {
  it('contains all 26 letters in order', () => {
    expect(LETTERS).toHaveLength(26);
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    expect(LETTERS.map((l) => l.letter)).toEqual(ALPHABET);
  });

  it('has English and German translations for every letter', () => {
    for (const entry of LETTERS) {
      expect(entry.translations.en.word).toBeTruthy();
      expect(entry.translations.en.emoji).toBeTruthy();
      expect(entry.translations.de.word).toBeTruthy();
      expect(entry.translations.de.emoji).toBeTruthy();
    }
  });

  it('attaches a color to every entry', () => {
    for (const entry of LETTERS) {
      expect(entry.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('uses kid-friendly mascot ties on B', () => {
    const b = LETTERS[1];
    expect(b.letter).toBe('B');
    expect(b.translations.en.word).toBe('Bee');
    expect(b.translations.de.word).toBe('Biene');
  });
});

describe('getLetter', () => {
  it('returns the entry for an uppercase letter', () => {
    expect(getLetter('A')?.letter).toBe('A');
  });

  it('is case insensitive', () => {
    expect(getLetter('z')?.letter).toBe('Z');
  });

  it('returns undefined for unknown ids', () => {
    expect(getLetter('AA')).toBeUndefined();
    expect(getLetter('1')).toBeUndefined();
    expect(getLetter('')).toBeUndefined();
    expect(getLetter(undefined)).toBeUndefined();
  });
});

describe('getLetterIndex', () => {
  it('returns 0 for A and 25 for Z', () => {
    expect(getLetterIndex('A')).toBe(0);
    expect(getLetterIndex('Z')).toBe(25);
  });

  it('is case insensitive', () => {
    expect(getLetterIndex('m')).toBe(12);
  });

  it('returns -1 for unknown letters', () => {
    expect(getLetterIndex('zz')).toBe(-1);
  });
});

describe('localized', () => {
  it('returns the English word/emoji when lang is en', () => {
    const a = LETTERS[0];
    expect(localized(a, 'en')).toEqual(a.translations.en);
  });

  it('returns the German word/emoji when lang is de', () => {
    const i = LETTERS[8];
    expect(localized(i, 'de').word).toBe('Igel');
  });
});
