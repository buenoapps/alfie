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

import type { Language } from '@/constants/letters';
import { t as translate, type StringKey } from '@/constants/strings';

const STORAGE_KEY = 'alfie:language';

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'de';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && isLanguage(stored)) {
          setLangState(stored);
        }
      })
      .catch(() => {
        // Storage failure is non-fatal — fall back to the default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
