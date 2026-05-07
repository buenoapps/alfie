import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alfie } from '@/components/alfie';
import { LanguageToggle } from '@/components/language-toggle';
import { LevelCard } from '@/components/level-card';
import { ThemedText } from '@/components/themed-text';
import { Palette, useTheme } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.screen }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <LanguageToggle />
        </View>

        <View style={styles.header}>
          <Alfie size={180} letter="A" />
          <ThemedText type="title" style={[styles.greeting, { color: theme.text }]}>
            {t('greeting')}
          </ThemedText>
          <ThemedText style={[styles.subgreeting, { color: theme.textSoft }]}>
            {t('pickLevel')}
          </ThemedText>
        </View>

        <View style={styles.levels}>
          <LevelCard
            emoji="🔤"
            title={t('levelLetters')}
            subtitle={t('levelLettersSubtitle')}
            background="#FFE9A8"
            border={Palette.honey}
            onPress={() => router.push('/alphabet')}
          />
          <LevelCard
            emoji="📖"
            title={t('levelWords')}
            subtitle={t('levelWordsSubtitle')}
            background="#FFD6E5"
            border={Palette.blossom}
            onPress={() => router.push('/words')}
          />
        </View>
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
    textAlign: 'center',
  },
  subgreeting: {
    marginTop: 4,
    textAlign: 'center',
  },
  levels: {
    gap: 16,
  },
});
