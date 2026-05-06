import { act, render, renderHook } from '@testing-library/react-native';
import { Text } from 'react-native';

import { LanguageProvider, useLanguage } from '@/contexts/language';

function wrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe('LanguageProvider / useLanguage', () => {
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
