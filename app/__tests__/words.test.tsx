import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import WordsScreen from '@/app/words';
import { LanguageProvider, useLanguage } from '@/contexts/language';

function Wrapped({ initialLang = 'en' as 'en' | 'de' }) {
  return (
    <LanguageProvider>
      <SetLang lang={initialLang} />
      <WordsScreen />
    </LanguageProvider>
  );
}

function SetLang({ lang }: { lang: 'en' | 'de' }) {
  const { setLang } = useLanguage();
  if (lang !== 'en') setLang(lang);
  return null;
}

describe('Words screen', () => {
  beforeEach(() => {
    const router = useRouter() as unknown as { push: jest.Mock; back: jest.Mock };
    router.push.mockClear();
    router.back.mockClear();
  });

  it('renders the EN word list by default', () => {
    const { getByLabelText } = render(<Wrapped />);
    expect(getByLabelText('Word Mum')).toBeTruthy();
    expect(getByLabelText('Word Dad')).toBeTruthy();
    expect(getByLabelText('Word Sun')).toBeTruthy();
  });

  it('renders the DE word list when language is German', () => {
    const { getByLabelText } = render(<Wrapped initialLang="de" />);
    expect(getByLabelText('Word Mama')).toBeTruthy();
    expect(getByLabelText('Word Papa')).toBeTruthy();
    expect(getByLabelText('Word Kaka')).toBeTruthy();
  });

  it('navigates to /word/<id> when a tile is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Word Mum'));
    expect(router.push).toHaveBeenCalledWith('/word/mum');
  });

  it('navigates to /word-quiz when Play is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Play word game'));
    expect(router.push).toHaveBeenCalledWith('/word-quiz');
  });

  it('calls router.back when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = render(<Wrapped />);
    fireEvent.press(getByLabelText('Home'));
    expect(router.back).toHaveBeenCalled();
  });
});
