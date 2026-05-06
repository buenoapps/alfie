import { act, fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

import QuizScreen from '@/app/quiz';
import { LanguageProvider } from '@/contexts/language';

const speak = Speech.speak as unknown as jest.Mock;
const stop = Speech.stop as unknown as jest.Mock;

function renderQuiz() {
  return render(
    <LanguageProvider>
      <QuizScreen />
    </LanguageProvider>
  );
}

describe('Quiz screen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    speak.mockClear();
    stop.mockClear();
    const router = useRouter() as unknown as { back: jest.Mock };
    router.back.mockClear();
    // Make Fisher-Yates a no-op so the question order is the alphabet
    // and each question's options are [answer, ...distractors] in order.
    jest.spyOn(Math, 'random').mockReturnValue(0.9999);
  });

  afterEach(() => {
    jest.useRealTimers();
    (Math.random as jest.Mock).mockRestore?.();
  });

  it('renders the quiz title and progress 1 / 5', () => {
    const { getByText } = renderQuiz();
    expect(getByText('Letter game')).toBeTruthy();
    expect(getByText('1 / 5')).toBeTruthy();
  });

  it('renders the prompt and 4 letter buttons', () => {
    const { getByText, getAllByLabelText } = renderQuiz();
    expect(getByText('Which letter?')).toBeTruthy();
    const buttons = getAllByLabelText(/^Letter [A-Z]$/);
    expect(buttons).toHaveLength(4);
  });

  it('auto-speaks the example word for the current question', () => {
    renderQuiz();
    expect(speak).toHaveBeenCalledWith(
      'Apple',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('speaks the word again when the emoji card is tapped', () => {
    const { getByLabelText } = renderQuiz();
    speak.mockClear();
    fireEvent.press(getByLabelText('Hear the word'));
    expect(speak).toHaveBeenCalledWith(
      'Apple',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('speaks the pressed letter on every option tap (right or wrong)', () => {
    const { getAllByLabelText } = renderQuiz();
    speak.mockClear();
    const buttons = getAllByLabelText(/^Letter [A-Z]$/);

    fireEvent.press(buttons[3]); // wrong
    expect(speak).toHaveBeenLastCalledWith(
      expect.stringMatching(/^[A-Z]\.$/),
      expect.objectContaining({ language: 'en-US' })
    );

    fireEvent.press(buttons[0]); // correct
    expect(speak).toHaveBeenLastCalledWith(
      'A.',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('disables a wrong answer after it is tapped, without advancing', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    const buttons = getAllByLabelText(/^Letter [A-Z]$/);
    const wrong = buttons[3];
    fireEvent.press(wrong);
    expect(getByText('1 / 5')).toBeTruthy();
    expect(wrong.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('advances to the next question after a correct answer', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    const correct = getAllByLabelText(/^Letter [A-Z]$/)[0];
    fireEvent.press(correct);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('2 / 5')).toBeTruthy();
  });

  it('shows the done view with score 5 after answering all five correctly', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    for (let i = 0; i < 5; i++) {
      const correct = getAllByLabelText(/^Letter [A-Z]$/)[0];
      fireEvent.press(correct);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(getByText('All done!')).toBeTruthy();
    expect(getByText('You got 5 out of 5!')).toBeTruthy();
  });

  it('does not increment the score if a wrong answer is tapped first', () => {
    const { getAllByLabelText, getByText } = renderQuiz();
    const buttons = getAllByLabelText(/^Letter [A-Z]$/);
    fireEvent.press(buttons[3]);
    fireEvent.press(buttons[0]);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    for (let i = 0; i < 4; i++) {
      const next = getAllByLabelText(/^Letter [A-Z]$/);
      fireEvent.press(next[0]);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(getByText('You got 4 out of 5!')).toBeTruthy();
  });

  it('returns home when the home button is pressed', () => {
    const router = useRouter() as unknown as { back: jest.Mock };
    const { getByLabelText } = renderQuiz();
    fireEvent.press(getByLabelText('Home'));
    expect(router.back).toHaveBeenCalled();
  });
});
