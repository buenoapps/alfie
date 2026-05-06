import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, renderHook, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { LanguageProvider, useLanguage } from '@/contexts/language';

function wrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe('LanguageProvider / useLanguage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it('defaults to English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.lang).toBe('en');
    expect(result.current.t('greeting')).toBe("Hi, I'm Alfie!");
  });

  it('updates when setLang is called', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLang('de'));
    expect(result.current.lang).toBe('de');
    expect(result.current.t('greeting')).toBe('Hallo, ich bin Alfie!');
  });

  it('persists the selected language to AsyncStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLang('de'));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('alfie:language', 'de');
  });

  it('hydrates the previously persisted language on mount', async () => {
    await AsyncStorage.setItem('alfie:language', 'de');
    const { result } = renderHook(() => useLanguage(), { wrapper });
    await waitFor(() => expect(result.current.lang).toBe('de'));
  });

  it('ignores invalid persisted values', async () => {
    await AsyncStorage.setItem('alfie:language', 'fr');
    const { result } = renderHook(() => useLanguage(), { wrapper });
    // Briefly waiting to allow the load effect to run; lang must stay 'en'.
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());
    expect(result.current.lang).toBe('en');
  });

  it('throws when used outside the provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    function Bare() {
      useLanguage();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/LanguageProvider/);
    consoleError.mockRestore();
  });

  it('exposes a t() that interpolates variables', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('quizScore', { score: 2, total: 5 })).toBe('You got 2 out of 5!');
  });

  it('renders translated content via consumer', () => {
    function Greeting() {
      const { t } = useLanguage();
      return <Text testID="greeting">{t('greeting')}</Text>;
    }
    const { getByTestId } = render(
      <LanguageProvider>
        <Greeting />
      </LanguageProvider>
    );
    expect(getByTestId('greeting').props.children).toBe("Hi, I'm Alfie!");
  });
});
