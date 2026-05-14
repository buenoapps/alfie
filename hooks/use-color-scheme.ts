import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * RN's useColorScheme can return 'light' | 'dark' | 'unspecified' | null.
 * The app only has two themes, so anything that isn't 'dark' is treated as light.
 */
export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
