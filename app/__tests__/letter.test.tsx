import { fireEvent, render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

import LetterScreen from '@/app/letter/[id]';
import { LanguageProvider, useLanguage } from '@/contexts/language';

const mockedParams = useLocalSearchParams as unknown as jest.Mock;
const speak = Speech.speak as unknown as jest.Mock;
const stop = Speech.stop as unknown as jest.Mock;

function Wrapped({ initialLang = 'en' as 'en' | 'de' }) {
  return (
    <LanguageProvider>
      <SetLang lang={initialLang} />
      <LetterScreen />
    </LanguageProvider>
  );
}

function SetLang({ lang }: { lang: 'en' | 'de' }) {
  const { setLang } = useLanguage();
  if (lang !== 'en') setLang(lang);
  return null;
}

describe('Letter detail screen', () => {
  beforeEach(() => {
    speak.mockClear();
    stop.mockClear();
    const router = useRouter() as unknown as { replace: jest.Mock; back: jest.Mock };
    router.replace.mockClear();
    router.back.mockClear();
    mockedParams.mockReturnValue({ id: 'B' });
  });

  it('renders the requested letter and its English example word', () => {
    const { getByText } = render(<Wrapped />);
    expect(getByText('B')).toBeTruthy();
    expect(getByText('b')).toBeTruthy();
    expect(getByText('Bee')).toBeTruthy();
    expect(getByText('🐝')).toBeTruthy();
  });

  it('speaks the word first on mount (emoji before letter)', () => {
    render(<Wrapped />);
    expect(speak).toHaveBeenCalledWith(
      'Bee',
      expect.objectContaining({ language: 'en-US' })
    );
    expect(speak.mock.calls[0][0]).toBe('Bee');
  });

  it('replaces the page content with the next letter (no navigation)', () => {
    const router = useRouter() as unknown as { replace: jest.Mock };
    const { getByLabelText, getByText, queryByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Next letter C'));
    expect(router.replace).not.toHaveBeenCalled();
    expect(getByText('C')).toBeTruthy();
    expect(getByText('Cat')).toBeTruthy();
    expect(queryByText('Bee')).toBeNull();
  });

  it('replaces the page content with the previous letter (no navigation)', () => {
    const router = useRouter() as unknown as { replace: jest.Mock };
    const { getByLabelText, getByText, queryByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Previous letter A'));
    expect(router.replace).not.toHaveBeenCalled();
    expect(getByText('A')).toBeTruthy();
    expect(getByText('Apple')).toBeTruthy();
    expect(queryByText('Bee')).toBeNull();
  });

  it('disables the previous arrow on A', () => {
    mockedParams.mockReturnValue({ id: 'A' });
    const { getByLabelText, getByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('No previous letter'));
    // Stays on A.
    expect(getByText('Apple')).toBeTruthy();
  });

  it('disables the next arrow on Z', () => {
    mockedParams.mockReturnValue({ id: 'Z' });
    const { getByLabelText, getByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('No next letter'));
    // Stays on Z.
    expect(getByText('Zebra')).toBeTruthy();
  });

  it('returns home when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Home'));
    expect(router.back).toHaveBeenCalled();
  });
});
