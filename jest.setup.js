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

// AsyncStorage in-memory mock used by the language persistence layer.
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
    },
  };
});

// react-native-svg renders fine through jest-expo's transformer; no mock needed.

// Silence noisy native warnings that happen during component mount in JSDOM.
const originalWarn = console.warn;
console.warn = (message, ...rest) => {
  if (typeof message === 'string' && message.includes('useNativeDriver')) return;
  originalWarn(message, ...rest);
};
