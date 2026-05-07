import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

import WordScreen from '@/app/word/[id]';
import { AudioProvider } from '@/contexts/audio';
import { LanguageProvider, useLanguage } from '@/contexts/language';

const mockedParams = useLocalSearchParams as unknown as jest.Mock;
const speak = Speech.speak as unknown as jest.Mock;
const stop = Speech.stop as unknown as jest.Mock;

function Wrapped({ initialLang = 'en' as 'en' | 'de' }) {
  return (
    <LanguageProvider>
      <AudioProvider>
        <SetLang lang={initialLang} />
        <WordScreen />
      </AudioProvider>
    </LanguageProvider>
  );
}

function SetLang({ lang }: { lang: 'en' | 'de' }) {
  const { setLang } = useLanguage();
  if (lang !== 'en') setLang(lang);
  return null;
}

describe('Word detail screen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    speak.mockClear();
    stop.mockClear();
    const router = useRouter() as unknown as { back: jest.Mock };
    router.back.mockClear();
    mockedParams.mockReturnValue({ id: 'sun' });
  });

  it('renders the requested word and emoji', () => {
    const { getByText } = render(<Wrapped />);
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('☀️')).toBeTruthy();
  });

  it('speaks the word on mount in the active language', () => {
    render(<Wrapped />);
    expect(speak).toHaveBeenCalledWith(
      'Sun',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('replays the word when the card is tapped', () => {
    const { getByLabelText } = render(<Wrapped />);
    speak.mockClear();
    fireEvent.press(getByLabelText('Hear the word'));
    expect(speak).toHaveBeenCalledWith(
      'Sun',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('replaces the page content with the next word in place', () => {
    mockedParams.mockReturnValue({ id: 'mum' });
    const { getByLabelText, getByText, queryByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Next word Dad'));
    expect(getByText('Dad')).toBeTruthy();
    expect(queryByText('Mum')).toBeNull();
  });

  it('replaces the page content with the previous word in place', () => {
    mockedParams.mockReturnValue({ id: 'dad' });
    const { getByLabelText, getByText, queryByText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Previous word Mum'));
    expect(getByText('Mum')).toBeTruthy();
    expect(queryByText('Dad')).toBeNull();
  });

  it('returns home when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Home'));
    expect(router.back).toHaveBeenCalled();
  });

  it('renders the German word when the language is DE', () => {
    mockedParams.mockReturnValue({ id: 'mama' });
    const { getByText } = render(<Wrapped initialLang="de" />);
    expect(getByText('Mama')).toBeTruthy();
  });

  it('does not speak on card tap when audio is muted', async () => {
    await AsyncStorage.setItem('alfie:audio-enabled', '0');
    const { getByLabelText } = render(<Wrapped />);
    // Wait for the async AudioProvider hydration to land.
    await waitFor(() => expect(getByLabelText('Unmute audio')).toBeTruthy());
    speak.mockClear();
    fireEvent.press(getByLabelText('Hear the word'));
    expect(speak).not.toHaveBeenCalled();
  });
});
