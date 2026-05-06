import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alfie } from '@/components/alfie';
import { LetterTile } from '@/components/letter-tile';
import { ThemedText } from '@/components/themed-text';
import { LETTERS } from '@/constants/letters';
import { Palette } from '@/constants/theme';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Alfie size={180} letter="A" />
          <ThemedText type="title" style={styles.greeting}>
            Hi, I&apos;m Alfie!
          </ThemedText>
          <ThemedText style={styles.subgreeting}>
            Tap a letter to learn it
          </ThemedText>
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
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  greeting: {
    marginTop: 8,
    color: Palette.ink,
  },
  subgreeting: {
    marginTop: 4,
    color: Palette.inkSoft,
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
