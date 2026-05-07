import { fireEvent, render } from '@testing-library/react-native';

import { SpeakerButton } from '@/components/speaker-button';

describe('SpeakerButton', () => {
  it('renders the unmuted label by default', () => {
    const { getByLabelText } = render(<SpeakerButton onPress={() => {}} />);
    expect(getByLabelText('Mute audio')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<SpeakerButton onPress={onPress} />);
    fireEvent.press(getByLabelText('Mute audio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the unmute label and selected state when muted', () => {
    const { getByLabelText } = render(<SpeakerButton onPress={() => {}} muted />);
    const button = getByLabelText('Unmute audio');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
  });
});
