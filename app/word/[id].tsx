import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
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
import { speechLocale } from '@/constants/strings';
import { Palette, tint, useTheme } from '@/constants/theme';
import { getWordIndex, getWords } from '@/constants/words';
import { useAudio } from '@/contexts/audio';
import { useLanguage } from '@/contexts/language';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WordScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { enabled: audioEnabled, toggle: toggleAudio } = useAudio();
  const theme = useTheme();
  const scheme = useColorScheme() ?? 'light';

  const words = getWords(lang);

  const [index, setIndex] = useState(() => {
    const i = getWordIndex(lang, id ?? '');
    return i === -1 ? 0 : i;
  });

  const safeIndex = Math.min(index, words.length - 1);
  const entry = words[safeIndex];
  const prev = safeIndex > 0 ? words[safeIndex - 1] : null;
  const next = safeIndex < words.length - 1 ? words[safeIndex + 1] : null;

  const cardScale = useSharedValue(0.6);

  const speak = useCallback(() => {
    if (!audioEnabled || !entry) return;
    Speech.stop();
    Speech.speak(entry.word, {
      rate: 0.85,
      pitch: 1.05,
      language: speechLocale(lang),
    });
  }, [audioEnabled, entry, lang]);

  useEffect(() => {
    cardScale.value = 0.6;
    cardScale.value = withSequence(
      withSpring(1.06, { damping: 9, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  }, [entry?.id, lang, cardScale]);

  useEffect(() => {
    speak();
    return () => {
      Speech.stop();
    };
  }, [speak]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const goToIndex = (nextIndex: number) => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    cardScale.value = withTiming(0.85, { duration: 90 });
    setIndex(nextIndex);
  };

  const goHome = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!entry) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.screen }]}>
        <View style={styles.topBar}>
          <RoundButton onPress={goHome} accessibilityLabel={t('back')}>
            <IconSymbol name="arrow.left" size={28} color={Palette.ink} />
          </RoundButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tint(entry.color, scheme) }]}>
      <View style={styles.topBar}>
        <RoundButton onPress={goHome} accessibilityLabel={t('back')}>
          <IconSymbol name="arrow.left" size={28} color={Palette.ink} />
        </RoundButton>
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.cardWrap, cardStyle]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hear the word"
            onPress={speak}
            style={styles.card}
          >
            <ThemedText style={styles.emoji}>{entry.emoji}</ThemedText>
            <ThemedText style={[styles.word, { color: theme.text }]}>{entry.word}</ThemedText>
          </Pressable>
        </Animated.View>

        <View style={styles.controls}>
          <RoundButton
            onPress={() => prev && goToIndex(safeIndex - 1)}
            disabled={!prev}
            accessibilityLabel={prev ? `Previous word ${prev.word}` : 'No previous word'}
          >
            <IconSymbol
              name="chevron.left"
              size={36}
              color={prev ? Palette.ink : Palette.inkSoft}
            />
          </RoundButton>

          <SpeakerButton onPress={toggleAudio} muted={!audioEnabled} />

          <RoundButton
            onPress={() => next && goToIndex(safeIndex + 1)}
            disabled={!next}
            accessibilityLabel={next ? `Next word ${next.word}` : 'No next word'}
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
  cardWrap: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: Palette.white,
    paddingHorizontal: 36,
    paddingVertical: 24,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Palette.honey,
    alignItems: 'center',
    gap: 12,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  emoji: {
    fontSize: 96,
    lineHeight: 128,
  },
  word: {
    fontSize: 80,
    lineHeight: 100,
    fontWeight: '900',
    color: Palette.ink,
    textAlign: 'center',
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
