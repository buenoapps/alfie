import { fireEvent, render } from '@testing-library/react-native';

import { LetterTile } from '@/components/letter-tile';

describe('LetterTile', () => {
  it('renders the letter', () => {
    const { getByText } = render(
      <LetterTile letter="A" color="#FFD86B" onPress={() => {}} />
    );
    expect(getByText('A')).toBeTruthy();
  });

  it('exposes an accessible button label', () => {
    const { getByLabelText } = render(
      <LetterTile letter="M" color="#FFD86B" onPress={() => {}} />
    );
    expect(getByLabelText('Letter M')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <LetterTile letter="Z" color="#FFD86B" onPress={onPress} />
    );
    fireEvent.press(getByLabelText('Letter Z'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
