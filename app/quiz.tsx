import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alfie } from '@/components/alfie';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LETTERS, type LetterEntry, localized } from '@/constants/letters';
import { speechLocale } from '@/constants/strings';
import { Palette, useTheme } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

const ROUND_SIZE = 5;
const OPTIONS_PER_QUESTION = 4;

type Question = {
  answer: LetterEntry;
  options: string[];
};

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildRound(): Question[] {
  const picks = shuffle(LETTERS).slice(0, ROUND_SIZE);
  return picks.map((answer) => {
    const distractors = shuffle(LETTERS.filter((l) => l.letter !== answer.letter))
      .slice(0, OPTIONS_PER_QUESTION - 1)
      .map((l) => l.letter);
    const options = shuffle([answer.letter, ...distractors]);
    return { answer, options };
  });
}

export default function QuizScreen() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const theme = useTheme();

  const [questions, setQuestions] = useState<Question[]>(() => buildRound());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<Set<string>>(new Set());
  const [correctChoice, setCorrectChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = questions[currentIndex];
  const word = current ? localized(current.answer, lang) : null;

  const speakWord = useCallback(
    (entry: LetterEntry) => {
      const w = localized(entry, lang);
      Speech.stop();
      Speech.speak(w.word, { rate: 0.85, pitch: 1.05, language: speechLocale(lang) });
    },
    [lang]
  );

  const speakLetter = useCallback(
    (letter: string) => {
      Speech.stop();
      Speech.speak(`${letter}.`, { rate: 0.85, pitch: 1.05, language: speechLocale(lang) });
    },
    [lang]
  );

  // Auto-speak the word whenever a new question appears.
  useEffect(() => {
    if (!current || done) return;
    speakWord(current.answer);
  }, [currentIndex, done, current, speakWord]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      Speech.stop();
    };
  }, []);

  const handleChoice = (letter: string) => {
    if (!current || done || correctChoice) return;
    speakLetter(letter);

    const correct = letter === current.answer.letter;

    if (!correct) {
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setWrongChoices((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(letter);
        return nextSet;
      });
      return;
    }

    if (process.env.EXPO_OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCorrectChoice(letter);
    if (wrongChoices.size === 0) {
      setScore((s) => s + 1);
    }

    advanceTimer.current = setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setWrongChoices(new Set());
        setCorrectChoice(null);
      }
    }, 900);
  };

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setQuestions(buildRound());
    setCurrentIndex(0);
    setWrongChoices(new Set());
    setCorrectChoice(null);
    setScore(0);
    setDone(false);
  };

  const goHome = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleEmojiPress = () => {
    if (current) speakWord(current.answer);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.screen }]}>
      <View style={styles.topBar}>
        <RoundButton onPress={goHome} accessibilityLabel={t('home')}>
          <IconSymbol name="house.fill" size={28} color={Palette.ink} />
        </RoundButton>
        <ThemedText type="subtitle" style={[styles.title, { color: theme.text }]}>
          {t('quizTitle')}
        </ThemedText>
        <View style={styles.progressPill}>
          <ThemedText style={styles.progressText}>
            {Math.min(currentIndex + 1, ROUND_SIZE)} / {ROUND_SIZE}
          </ThemedText>
        </View>
      </View>

      {done || !current || !word ? (
        <DoneView score={score} total={questions.length} onRestart={restart} onHome={goHome} />
      ) : (
        <QuestionView
          key={currentIndex}
          emoji={word.emoji}
          prompt={t('whichLetter')}
          options={current.options}
          wrongChoices={wrongChoices}
          correctChoice={correctChoice}
          onChoose={handleChoice}
          onEmojiPress={handleEmojiPress}
        />
      )}
    </SafeAreaView>
  );
}

type QuestionViewProps = {
  emoji: string;
  prompt: string;
  options: string[];
  wrongChoices: Set<string>;
  correctChoice: string | null;
  onChoose: (letter: string) => void;
  onEmojiPress: () => void;
};

function QuestionView({
  emoji,
  prompt,
  options,
  wrongChoices,
  correctChoice,
  onChoose,
  onEmojiPress,
}: QuestionViewProps) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.questionContent}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hear the word"
        onPress={onEmojiPress}
        style={styles.emojiCard}
      >
        <ThemedText style={styles.bigEmoji}>{emoji}</ThemedText>
      </Pressable>
      <ThemedText type="subtitle" style={[styles.prompt, { color: theme.textSoft }]}>
        {prompt}
      </ThemedText>

      <View style={styles.optionsGrid}>
        {options.map((letter) => (
          <View key={letter} style={styles.optionCell}>
            <OptionButton
              letter={letter}
              wrong={wrongChoices.has(letter)}
              correct={correctChoice === letter}
              disabled={correctChoice !== null}
              onPress={() => onChoose(letter)}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

type OptionButtonProps = {
  letter: string;
  wrong: boolean;
  correct: boolean;
  disabled: boolean;
  onPress: () => void;
};

function OptionButton({ letter, wrong, correct, disabled, onPress }: OptionButtonProps) {
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (wrong) {
      shake.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [wrong, shake]);

  useEffect(() => {
    if (correct) {
      scale.value = withSequence(
        withSpring(1.12, { damping: 10, stiffness: 220 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
    }
  }, [correct, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: scale.value }],
  }));

  const isInactive = wrong || (disabled && !correct);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Letter ${letter}`}
        accessibilityState={{ disabled: isInactive, selected: correct }}
        disabled={isInactive || correct}
        onPressIn={() => {
          scale.value = withSpring(0.93, { damping: 12, stiffness: 240 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        onPress={onPress}
        style={[
          styles.option,
          wrong && styles.optionWrong,
          correct && styles.optionCorrect,
        ]}
      >
        <ThemedText
          style={[
            styles.optionLetter,
            wrong && styles.optionLetterWrong,
            correct && styles.optionLetterCorrect,
          ]}
        >
          {letter}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

type DoneViewProps = {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
};

function DoneView({ score, total, onRestart, onHome }: DoneViewProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(450)} style={styles.doneContent}>
      <Alfie size={200} letter={`${score}`} />
      <ThemedText type="title" style={[styles.doneTitle, { color: theme.text }]}>
        {t('quizDoneTitle')}
      </ThemedText>
      <ThemedText style={[styles.doneScore, { color: theme.textSoft }]}>
        {t('quizScore', { score, total })}
      </ThemedText>
      <View style={styles.doneActions}>
        <Pressable
          accessibilityRole="button"
          onPress={onRestart}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        >
          <ThemedText style={styles.primaryButtonLabel}>{t('playAgain')}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onHome}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
        >
          <ThemedText style={styles.secondaryButtonLabel}>{t('home')}</ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

type RoundButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
};

function RoundButton({ onPress, children, accessibilityLabel }: RoundButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {},
  progressPill: {
    minWidth: 56,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Palette.honey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.ink,
  },
  questionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  emojiCard: {
    width: 220,
    height: 220,
    borderRadius: 36,
    backgroundColor: Palette.white,
    borderWidth: 4,
    borderColor: Palette.honey,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  bigEmoji: {
    fontSize: 120,
    lineHeight: 168,
    textAlign: 'center',
  },
  prompt: {},
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginHorizontal: -6,
  },
  optionCell: {
    width: '50%',
    padding: 6,
  },
  option: {
    aspectRatio: 1.4,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
    borderWidth: 3,
    borderColor: Palette.honey,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  optionWrong: {
    backgroundColor: '#FFD6D6',
    borderColor: '#E76A6A',
    opacity: 0.85,
  },
  optionCorrect: {
    backgroundColor: '#CFF1CF',
    borderColor: '#5DBE5D',
  },
  optionLetter: {
    fontSize: 64,
    lineHeight: 80,
    fontWeight: '900',
    color: Palette.ink,
    textAlign: 'center',
    includeFontPadding: false,
  },
  optionLetterWrong: {
    color: '#9A2E2E',
  },
  optionLetterCorrect: {
    color: '#1F6E1F',
  },
  doneContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  doneTitle: {
    marginTop: 8,
  },
  doneScore: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  doneActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: Palette.blossom,
    borderWidth: 3,
    borderColor: Palette.blossomDark,
  },
  primaryButtonLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.white,
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: Palette.white,
    borderWidth: 3,
    borderColor: Palette.honey,
  },
  secondaryButtonLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.ink,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },
  roundButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  roundButtonPressed: {
    transform: [{ scale: 0.94 }],
  },
});
