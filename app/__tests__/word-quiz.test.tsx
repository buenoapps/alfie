import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

import WordQuizScreen from '@/app/word-quiz';
import { AudioProvider } from '@/contexts/audio';
import { LanguageProvider } from '@/contexts/language';

const speak = Speech.speak as unknown as jest.Mock;
const stop = Speech.stop as unknown as jest.Mock;

function renderQuiz() {
  return render(
    <LanguageProvider>
      <AudioProvider>
        <WordQuizScreen />
      </AudioProvider>
    </LanguageProvider>
  );
}

describe('Word quiz screen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.useFakeTimers();
    speak.mockClear();
    stop.mockClear();
    const router = useRouter() as unknown as { back: jest.Mock };
    router.back.mockClear();
    // Identity shuffle so the answer is always at option index 0 and the
    // round picks the first 5 words from the EN list.
    jest.spyOn(Math, 'random').mockReturnValue(0.9999);
  });

  afterEach(() => {
    jest.useRealTimers();
    (Math.random as jest.Mock).mockRestore?.();
  });

  it('renders the title and progress 1 / 5', () => {
    const { getByText } = renderQuiz();
    expect(getByText('Word game')).toBeTruthy();
    expect(getByText('1 / 5')).toBeTruthy();
  });

  it('renders 4 word buttons for each question', () => {
    const { getAllByLabelText } = renderQuiz();
    const buttons = getAllByLabelText(/^Word [A-Za-z]+$/);
    expect(buttons).toHaveLength(4);
  });

  it('auto-speaks the answer on mount', () => {
    renderQuiz();
    expect(speak).toHaveBeenCalledWith(
      'Mum',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('replays the word when the emoji card is tapped', () => {
    const { getByLabelText } = renderQuiz();
    speak.mockClear();
    fireEvent.press(getByLabelText('Hear the word'));
    expect(speak).toHaveBeenCalledWith(
      'Mum',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('shakes a wrong answer without advancing', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    const buttons = getAllByLabelText(/^Word [A-Za-z]+$/);
    const wrong = buttons[3];
    fireEvent.press(wrong);
    expect(getByText('1 / 5')).toBeTruthy();
    expect(wrong.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('flags the correct answer and advances after the timer', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    const correct = getAllByLabelText(/^Word [A-Za-z]+$/)[0];
    fireEvent.press(correct);
    const flagged = getAllByLabelText(/^Word [A-Za-z]+$/)[0];
    expect(flagged.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('2 / 5')).toBeTruthy();
  });

  it('shows the done view with score 5 after answering all five correctly', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    for (let i = 0; i < 5; i++) {
      const correct = getAllByLabelText(/^Word [A-Za-z]+$/)[0];
      fireEvent.press(correct);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(getByText('All done!')).toBeTruthy();
    expect(getByText('You got 5 out of 5!')).toBeTruthy();
  });

  it('returns home when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = renderQuiz();
    fireEvent.press(getByLabelText('Home'));
    expect(router.back).toHaveBeenCalled();
  });

  describe('with audio muted', () => {
    beforeEach(async () => {
      await AsyncStorage.setItem('alfie:audio-enabled', '0');
    });

    it('does not speak the answer on mount', async () => {
      const { getAllByLabelText } = renderQuiz();
      await waitFor(() =>
        expect(getAllByLabelText(/^Word [A-Za-z]+$/)).toHaveLength(4)
      );
      speak.mockClear();
      fireEvent.press(getAllByLabelText('Hear the word')[0]);
      expect(speak).not.toHaveBeenCalled();
    });

    it('does not speak the choice on option taps', async () => {
      const { getAllByLabelText } = renderQuiz();
      await waitFor(() =>
        expect(getAllByLabelText(/^Word [A-Za-z]+$/)).toHaveLength(4)
      );
      speak.mockClear();
      fireEvent.press(getAllByLabelText(/^Word [A-Za-z]+$/)[0]);
      expect(speak).not.toHaveBeenCalled();
    });
  });
});
