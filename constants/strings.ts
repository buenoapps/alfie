import type { Language } from '@/constants/letters';

export type StringKey =
  | 'greeting'
  | 'pickLevel'
  | 'levelLetters'
  | 'levelLettersSubtitle'
  | 'levelWords'
  | 'levelWordsSubtitle'
  | 'tapLetterToLearn'
  | 'tapWordToLearn'
  | 'playLetters'
  | 'playWords'
  | 'quizTitle'
  | 'wordQuizTitle'
  | 'whichLetter'
  | 'whichWord'
  | 'tryAgain'
  | 'great'
  | 'quizDoneTitle'
  | 'quizScore'
  | 'playAgain'
  | 'home'
  | 'back'
  | 'language';

export const Strings: Record<Language, Record<StringKey, string>> = {
  en: {
    greeting: "Hi, I'm Alfie!",
    pickLevel: 'Pick a level',
    levelLetters: 'Letters',
    levelLettersSubtitle: 'Learn the alphabet',
    levelWords: 'Words',
    levelWordsSubtitle: 'Short, simple words',
    tapLetterToLearn: 'Tap a letter to learn it',
    tapWordToLearn: 'Tap a word to learn it',
    playLetters: 'Play letter game',
    playWords: 'Play word game',
    quizTitle: 'Letter game',
    wordQuizTitle: 'Word game',
    whichLetter: 'Which letter?',
    whichWord: 'Which word?',
    tryAgain: 'Try again',
    great: 'Great!',
    quizDoneTitle: 'All done!',
    quizScore: 'You got {score} out of {total}!',
    playAgain: 'Play again',
    home: 'Home',
    back: 'Back',
    language: 'Language',
  },
  de: {
    greeting: 'Hallo, ich bin Alfie!',
    pickLevel: 'Wähle eine Stufe',
    levelLetters: 'Buchstaben',
    levelLettersSubtitle: 'Das Alphabet lernen',
    levelWords: 'Wörter',
    levelWordsSubtitle: 'Kurze, einfache Wörter',
    tapLetterToLearn: 'Tippe einen Buchstaben an',
    tapWordToLearn: 'Tippe ein Wort an',
    playLetters: 'Buchstabenspiel',
    playWords: 'Wörterspiel',
    quizTitle: 'Buchstabenspiel',
    wordQuizTitle: 'Wörterspiel',
    whichLetter: 'Welcher Buchstabe?',
    whichWord: 'Welches Wort?',
    tryAgain: 'Nochmal',
    great: 'Super!',
    quizDoneTitle: 'Geschafft!',
    quizScore: '{score} von {total} richtig!',
    playAgain: 'Nochmal spielen',
    home: 'Start',
    back: 'Zurück',
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
