import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Language } from '@/constants/letters';
import { Palette } from '@/constants/theme';
import { useLanguage } from '@/contexts/language';

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <View style={styles.row}>
      {LANGS.map(({ code, label }) => {
        const active = lang === code;
        return (
          <Pressable
            key={code}
            accessibilityRole="button"
            accessibilityLabel={`Language ${label}`}
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (lang === code) return;
              if (process.env.EXPO_OS === 'ios') {
                Haptics.selectionAsync();
              }
              setLang(code);
            }}
            style={[styles.pill, active && styles.pillActive]}
          >
            <ThemedText style={[styles.label, active && styles.labelActive]}>
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: 999,
    padding: 4,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    minWidth: 48,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Palette.honey,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.inkSoft,
  },
  labelActive: {
    color: Palette.ink,
  },
});
