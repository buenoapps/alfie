import { Strings, speechLocale, t } from '@/constants/strings';

describe('Strings table', () => {
  it('defines every key for both languages', () => {
    const enKeys = Object.keys(Strings.en).sort();
    const deKeys = Object.keys(Strings.de).sort();
    expect(deKeys).toEqual(enKeys);
  });
});

describe('t()', () => {
  it('returns the right value for the given language', () => {
    expect(t('en', 'greeting')).toBe("Hi, I'm Alfie!");
    expect(t('de', 'greeting')).toBe('Hallo, ich bin Alfie!');
  });

  it('substitutes named variables', () => {
    expect(t('en', 'quizScore', { score: 3, total: 5 })).toBe('You got 3 out of 5!');
    expect(t('de', 'quizScore', { score: 4, total: 5 })).toBe('4 von 5 richtig!');
  });

  it('leaves placeholders untouched when no vars are provided', () => {
    expect(t('en', 'quizScore')).toContain('{score}');
    expect(t('en', 'quizScore')).toContain('{total}');
  });
});

describe('speechLocale()', () => {
  it('maps en to en-US', () => {
    expect(speechLocale('en')).toBe('en-US');
  });

  it('maps de to de-DE', () => {
    expect(speechLocale('de')).toBe('de-DE');
  });
});
