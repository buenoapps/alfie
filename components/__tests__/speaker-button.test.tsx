import { fireEvent, render } from '@testing-library/react-native';

import { SpeakerButton } from '@/components/speaker-button';

describe('SpeakerButton', () => {
  it('renders with the "Hear it again" label', () => {
    const { getByLabelText } = render(<SpeakerButton onPress={() => {}} />);
    expect(getByLabelText('Hear it again')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<SpeakerButton onPress={onPress} />);
    fireEvent.press(getByLabelText('Hear it again'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
