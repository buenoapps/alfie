import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpeakerButton } from '@/components/speaker-button';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LETTERS, getLetterIndex, localized } from '@/constants/letters';
import { speechLocale } from '@/constants/strings';
import { Palette } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

export default function LetterScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lang } = useLanguage();

  const index = useMemo(() => {
    const i = getLetterIndex(id ?? '');
    return i === -1 ? 0 : i;
  }, [id]);

  const entry = LETTERS[index];
  const word = localized(entry, lang);
  const prev = index > 0 ? LETTERS[index - 1] : null;
  const next = index < LETTERS.length - 1 ? LETTERS[index + 1] : null;

  const blockScale = useSharedValue(0.6);

  const speak = useCallback(() => {
    Speech.stop();
    const locale = speechLocale(lang);
    Speech.speak(word.word, {
      rate: 0.85,
      pitch: 1.05,
      language: locale,
      onDone: () => {
        Speech.speak(`${entry.letter}.`, { rate: 0.85, pitch: 1.05, language: locale });
      },
    });
  }, [entry.letter, word.word, lang]);

  useEffect(() => {
    blockScale.value = 0.6;
    blockScale.value = withSequence(
      withSpring(1.06, { damping: 9, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    speak();
    return () => {
      Speech.stop();
    };
  }, [entry.letter, lang, speak, blockScale]);

  const blockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: blockScale.value }],
  }));

  const goTo = (letter: string) => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    blockScale.value = withTiming(0.85, { duration: 90 });
    router.replace(`/letter/${letter}`);
  };

  const goHome = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tint(entry.color) }]}>
      <View style={styles.topBar}>
        <RoundButton onPress={goHome} accessibilityLabel="Home">
          <IconSymbol name="house.fill" size={28} color={Palette.ink} />
        </RoundButton>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.wordRow}>
          <ThemedText style={styles.emoji}>{word.emoji}</ThemedText>
          <ThemedText type="title" style={styles.word}>
            {word.word}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).duration(500)}
          style={[styles.bigLetterWrap, blockStyle]}
        >
          <Pressable onPress={speak} accessibilityRole="button" style={styles.bigLetterBlock}>
            <ThemedText style={styles.bigLetterUpper}>{entry.letter}</ThemedText>
            <ThemedText style={styles.bigLetterLower}>{entry.letter.toLowerCase()}</ThemedText>
          </Pressable>
        </Animated.View>

        <View style={styles.controls}>
          <RoundButton
            onPress={() => prev && goTo(prev.letter)}
            disabled={!prev}
            accessibilityLabel={prev ? `Previous letter ${prev.letter}` : 'No previous letter'}
          >
            <IconSymbol
              name="chevron.left"
              size={36}
              color={prev ? Palette.ink : Palette.inkSoft}
            />
          </RoundButton>

          <SpeakerButton onPress={speak} />

          <RoundButton
            onPress={() => next && goTo(next.letter)}
            disabled={!next}
            accessibilityLabel={next ? `Next letter ${next.letter}` : 'No next letter'}
          >
            <IconSymbol
              name="chevron.right"
              size={36}
              color={next ? Palette.ink : Palette.inkSoft}
            />
          </RoundButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

type RoundButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
};

function RoundButton({ onPress, children, disabled, accessibilityLabel }: RoundButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.roundButton,
        disabled && styles.roundButtonDisabled,
        pressed && !disabled && styles.roundButtonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

function tint(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return hex;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c * 0.45 + 255 * 0.55);
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 72,
    lineHeight: 96,
  },
  word: {
    color: Palette.ink,
  },
  bigLetterWrap: {
    alignItems: 'center',
  },
  bigLetterBlock: {
    backgroundColor: Palette.white,
    paddingHorizontal: 36,
    paddingVertical: 24,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Palette.honey,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 18,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  bigLetterUpper: {
    fontSize: 132,
    lineHeight: 160,
    fontWeight: '900',
    color: Palette.ink,
    includeFontPadding: false,
  },
  bigLetterLower: {
    fontSize: 88,
    lineHeight: 108,
    fontWeight: '800',
    color: Palette.honeyDark,
    includeFontPadding: false,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  roundButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  roundButtonDisabled: {
    opacity: 0.35,
  },
});
