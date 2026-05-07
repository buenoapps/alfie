import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import { AudioProvider } from '@/contexts/audio';
import { LanguageProvider } from '@/contexts/language';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <AudioProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.screen },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="letter/[id]" options={{ animation: 'fade_from_bottom' }} />
              <Stack.Screen name="quiz" options={{ animation: 'fade_from_bottom' }} />
            </Stack>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          </AudioProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
