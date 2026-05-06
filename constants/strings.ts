import type { Language } from '@/constants/letters';

export type StringKey =
  | 'greeting'
  | 'tapToLearn'
  | 'play'
  | 'quizTitle'
  | 'whichLetter'
  | 'tryAgain'
  | 'great'
  | 'quizDoneTitle'
  | 'quizScore'
  | 'playAgain'
  | 'home'
  | 'language';

export const Strings: Record<Language, Record<StringKey, string>> = {
  en: {
    greeting: "Hi, I'm Alfie!",
    tapToLearn: 'Tap a letter to learn it',
    play: 'Play a game',
    quizTitle: 'Letter game',
    whichLetter: 'Which letter?',
    tryAgain: 'Try again',
    great: 'Great!',
    quizDoneTitle: 'All done!',
    quizScore: 'You got {score} out of {total}!',
    playAgain: 'Play again',
    home: 'Home',
    language: 'Language',
  },
  de: {
    greeting: 'Hallo, ich bin Alfie!',
    tapToLearn: 'Tippe einen Buchstaben an',
    play: 'Spiel starten',
    quizTitle: 'Buchstabenspiel',
    whichLetter: 'Welcher Buchstabe?',
    tryAgain: 'Nochmal',
    great: 'Super!',
    quizDoneTitle: 'Geschafft!',
    quizScore: '{score} von {total} richtig!',
    playAgain: 'Nochmal spielen',
    home: 'Start',
    language: 'Sprache',
  },
};

export function t(lang: Language, key: StringKey, vars?: Record<string, string | number>): string {
  let value = Strings[lang][key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

export function speechLocale(lang: Language): string {
  return lang === 'de' ? 'de-DE' : 'en-US';
}
