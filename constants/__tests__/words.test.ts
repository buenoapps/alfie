import { getWord, getWordIndex, getWords } from '@/constants/words';

describe('Words dataset', () => {
  it('returns a non-empty list for EN and DE', () => {
    expect(getWords('en').length).toBeGreaterThan(0);
    expect(getWords('de').length).toBeGreaterThan(0);
  });

  it('keeps every entry at 4 characters or fewer', () => {
    for (const lang of ['en', 'de'] as const) {
      for (const entry of getWords(lang)) {
        expect(entry.word.length).toBeLessThanOrEqual(4);
        expect(entry.word.length).toBeGreaterThan(0);
      }
    }
  });

  it('uses unique ids per language', () => {
    for (const lang of ['en', 'de'] as const) {
      const ids = getWords(lang).map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('uses lowercased ids derived from the word', () => {
    for (const lang of ['en', 'de'] as const) {
      for (const entry of getWords(lang)) {
        expect(entry.id).toBe(entry.word.toLowerCase());
      }
    }
  });

  it('includes the kid-friendly anchors named in the brief', () => {
    const enWords = getWords('en').map((w) => w.word);
    expect(enWords).toEqual(expect.arrayContaining(['Mum', 'Dad', 'Sun']));
    const deWords = getWords('de').map((w) => w.word);
    expect(deWords).toEqual(expect.arrayContaining(['Mama', 'Papa', 'Kaka', 'Bus']));
  });

  it('attaches a hex color to every entry', () => {
    for (const lang of ['en', 'de'] as const) {
      for (const entry of getWords(lang)) {
        expect(entry.color).toMatch(/^#[0-9A-F]{6}$/i);
      }
    }
  });
});

describe('getWord', () => {
  it('returns the entry by lowercase id', () => {
    expect(getWord('en', 'mum')?.word).toBe('Mum');
    expect(getWord('de', 'mama')?.word).toBe('Mama');
  });

  it('is case insensitive', () => {
    expect(getWord('en', 'MUM')?.word).toBe('Mum');
    expect(getWord('de', 'Kaka')?.word).toBe('Kaka');
  });

  it('returns undefined for unknown ids', () => {
    expect(getWord('en', 'nope')).toBeUndefined();
    expect(getWord('en', '')).toBeUndefined();
    expect(getWord('en', undefined)).toBeUndefined();
  });

  it('respects the language scope', () => {
    expect(getWord('en', 'mama')).toBeUndefined();
    expect(getWord('de', 'mum')).toBeUndefined();
  });
});

describe('getWordIndex', () => {
  it('returns 0 for the first entry of each list', () => {
    expect(getWordIndex('en', getWords('en')[0].id)).toBe(0);
    expect(getWordIndex('de', getWords('de')[0].id)).toBe(0);
  });

  it('returns -1 for unknown ids', () => {
    expect(getWordIndex('en', 'nope')).toBe(-1);
  });
});
