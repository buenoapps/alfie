import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'alfie:audio-enabled';

type AudioContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  toggle: () => void;
};

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

function decode(value: unknown): boolean | null {
  if (value === '1') return true;
  if (value === '0') return false;
  return null;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        const parsed = decode(stored);
        if (!cancelled && parsed !== null) {
          setEnabledState(parsed);
        }
      })
      .catch(() => {
        // Storage failure is non-fatal — keep the default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0').catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0').catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle }),
    [enabled, setEnabled, toggle]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}
