/* eslint-disable @typescript-eslint/no-require-imports */

// Reanimated provides a built-in jest mock that stubs animated APIs.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// expo-router: provide minimal stubs used by our screens.
jest.mock('expo-router', () => {
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  };
  return {
    __esModule: true,
    useRouter: () => router,
    useLocalSearchParams: jest.fn(() => ({})),
    Stack: { Screen: () => null },
    Link: ({ children }) => children,
    router,
  };
});

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-symbols', () => ({
  SymbolView: 'SymbolView',
}));

// react-native-svg renders fine through jest-expo's transformer; no mock needed.

// Silence noisy native warnings that happen during component mount in JSDOM.
const originalWarn = console.warn;
console.warn = (message, ...rest) => {
  if (typeof message === 'string' && message.includes('useNativeDriver')) return;
  originalWarn(message, ...rest);
};
