import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import AlphabetScreen from '@/app/alphabet';
import { LanguageProvider } from '@/contexts/language';

function renderAlphabet() {
  return render(
    <LanguageProvider>
      <AlphabetScreen />
    </LanguageProvider>
  );
}

describe('Alphabet screen', () => {
  beforeEach(() => {
    const router = useRouter() as unknown as { push: jest.Mock; back: jest.Mock };
    router.push.mockClear();
    router.back.mockClear();
  });

  it('renders the localized subtitle', () => {
    const { getByText } = renderAlphabet();
    expect(getByText('Tap a letter to learn it')).toBeTruthy();
  });

  it('renders the level title in the top bar', () => {
    const { getByText } = renderAlphabet();
    expect(getByText('Letters')).toBeTruthy();
  });

  it('renders a tile for every letter A–Z', () => {
    const { getByLabelText } = renderAlphabet();
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      expect(getByLabelText(`Letter ${letter}`)).toBeTruthy();
    }
  });

  it('navigates to /letter/<id> when a tile is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderAlphabet();
    fireEvent.press(getByLabelText('Letter B'));
    expect(router.push).toHaveBeenCalledWith('/letter/B');
  });

  it('navigates to the letter quiz when Play is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderAlphabet();
    fireEvent.press(getByLabelText('Play letter game'));
    expect(router.push).toHaveBeenCalledWith('/quiz');
  });

  it('calls router.back when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = renderAlphabet();
    fireEvent.press(getByLabelText('Back'));
    expect(router.back).toHaveBeenCalled();
  });
});
