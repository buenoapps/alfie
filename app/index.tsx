import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alfie } from '@/components/alfie';
import { LanguageToggle } from '@/components/language-toggle';
import { LetterTile } from '@/components/letter-tile';
import { ThemedText } from '@/components/themed-text';
import { LETTERS } from '@/constants/letters';
import { Palette } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  const startQuiz = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/quiz');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <LanguageToggle />
        </View>

        <View style={styles.header}>
          <Alfie size={180} letter="A" />
          <ThemedText type="title" style={styles.greeting}>
            {t('greeting')}
          </ThemedText>
          <ThemedText style={styles.subgreeting}>{t('tapToLearn')}</ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('play')}
            onPress={startQuiz}
            style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
          >
            <ThemedText style={styles.playEmoji}>🎮</ThemedText>
            <ThemedText style={styles.playLabel}>{t('play')}</ThemedText>
          </Pressable>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.cream,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 4,
  },
  header: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 24,
  },
  greeting: {
    marginTop: 8,
    color: Palette.ink,
    textAlign: 'center',
  },
  subgreeting: {
    marginTop: 4,
    color: Palette.inkSoft,
    textAlign: 'center',
  },
  playButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
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
    transform: [{ scale: 0.96 }],
  },
  playEmoji: {
    fontSize: 24,
  },
  playLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.white,
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
});
