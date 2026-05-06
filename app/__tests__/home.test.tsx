import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import Home from '@/app/index';
import { LanguageProvider } from '@/contexts/language';

function renderHome() {
  return render(
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
}

describe('Home screen', () => {
  beforeEach(() => {
    const router = useRouter() as unknown as { push: jest.Mock };
    router.push.mockClear();
  });

  it('greets in English by default', () => {
    const { getByText } = renderHome();
    expect(getByText("Hi, I'm Alfie!")).toBeTruthy();
    expect(getByText('Tap a letter to learn it')).toBeTruthy();
  });

  it('renders a tile for every letter A–Z', () => {
    const { getByLabelText } = renderHome();
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      expect(getByLabelText(`Letter ${letter}`)).toBeTruthy();
    }
  });

  it('navigates to /letter/<letter> when a tile is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderHome();
    fireEvent.press(getByLabelText('Letter B'));
    expect(router.push).toHaveBeenCalledWith('/letter/B');
  });

  it('navigates to /quiz when the Play button is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderHome();
    fireEvent.press(getByLabelText('Play a game'));
    expect(router.push).toHaveBeenCalledWith('/quiz');
  });

  it('switches greeting to German when the toggle is pressed', () => {
    const { getByText, getByLabelText, queryByText } = renderHome();
    fireEvent.press(getByLabelText('Language DE'));
    expect(getByText('Hallo, ich bin Alfie!')).toBeTruthy();
    expect(queryByText("Hi, I'm Alfie!")).toBeNull();
  });
});
