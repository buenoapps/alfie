import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LetterTile } from '@/components/letter-tile';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LETTERS } from '@/constants/letters';
import { Palette, useTheme } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

export default function AlphabetScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const theme = useTheme();

  const goHome = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const startQuiz = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/quiz');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.screen }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home')}
            onPress={goHome}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <IconSymbol name="house.fill" size={28} color={Palette.ink} />
          </Pressable>
          <ThemedText style={[styles.subtitle, { color: theme.textSoft }]}>
            {t('tapLetterToLearn')}
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        <View style={styles.grid}>
          {LETTERS.map(({ letter, color }) => (
            <View key={letter} style={styles.cell}>
              <LetterTile
                letter={letter}
                color={color}
                onPress={() => router.push(`/letter/${letter}`)}
              />
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('playLetters')}
          onPress={startQuiz}
          style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
        >
          <ThemedText style={styles.playEmoji}>🎮</ThemedText>
          <ThemedText style={styles.playLabel}>{t('playLetters')}</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 16,
  },
  backButton: {
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
  backButtonPressed: {
    transform: [{ scale: 0.94 }],
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 56,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  cell: {
    width: '25%',
    padding: 6,
  },
  playButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: Palette.blossom,
    borderWidth: 3,
    borderColor: Palette.blossomDark,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  playButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  playEmoji: {
    fontSize: 24,
  },
  playLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.white,
  },
});
