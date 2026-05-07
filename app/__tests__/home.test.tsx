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
    expect(getByText('Pick a level')).toBeTruthy();
  });

  it('renders the two level cards', () => {
    const { getByText } = renderHome();
    expect(getByText('Letters')).toBeTruthy();
    expect(getByText('Learn the alphabet')).toBeTruthy();
    expect(getByText('Words')).toBeTruthy();
    expect(getByText('Short, simple words')).toBeTruthy();
  });

  it('navigates to /alphabet when the Letters card is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderHome();
    fireEvent.press(getByLabelText('Letters'));
    expect(router.push).toHaveBeenCalledWith('/alphabet');
  });

  it('navigates to /words when the Words card is tapped', () => {
    const router = useRouter() as unknown as { push: jest.Mock };
    const { getByLabelText } = renderHome();
    fireEvent.press(getByLabelText('Words'));
    expect(router.push).toHaveBeenCalledWith('/words');
  });

  it('flips strings to German when the toggle is pressed', () => {
    const { getByText, getByLabelText, queryByText } = renderHome();
    fireEvent.press(getByLabelText('Language DE'));
    expect(getByText('Hallo, ich bin Alfie!')).toBeTruthy();
    expect(getByText('Wähle eine Stufe')).toBeTruthy();
    expect(getByText('Buchstaben')).toBeTruthy();
    expect(getByText('Wörter')).toBeTruthy();
    expect(queryByText("Hi, I'm Alfie!")).toBeNull();
  });
});
