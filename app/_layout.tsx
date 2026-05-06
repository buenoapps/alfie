import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/contexts/language';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFBEA' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="letter/[id]" options={{ animation: 'fade_from_bottom' }} />
            <Stack.Screen name="quiz" options={{ animation: 'fade_from_bottom' }} />
          </Stack>
          <StatusBar style="dark" />
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
