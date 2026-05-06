import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { LanguageToggle } from '@/components/language-toggle';
import { LanguageProvider, useLanguage } from '@/contexts/language';

function Probe() {
  const { lang } = useLanguage();
  return <Text testID="lang">{lang}</Text>;
}

function renderToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      <Probe />
    </LanguageProvider>
  );
}

describe('LanguageToggle', () => {
  it('renders both EN and DE buttons', () => {
    const { getByLabelText } = renderToggle();
    expect(getByLabelText('Language EN')).toBeTruthy();
    expect(getByLabelText('Language DE')).toBeTruthy();
  });

  it('switches the language when DE is pressed', () => {
    const { getByLabelText, getByTestId } = renderToggle();
    expect(getByTestId('lang').props.children).toBe('en');
    fireEvent.press(getByLabelText('Language DE'));
    expect(getByTestId('lang').props.children).toBe('de');
  });

  it('marks the active language as selected via accessibility state', () => {
    const { getByLabelText } = renderToggle();
    const en = getByLabelText('Language EN');
    const de = getByLabelText('Language DE');
    expect(en.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    expect(de.props.accessibilityState).toEqual(expect.objectContaining({ selected: false }));

    fireEvent.press(de);
    expect(getByLabelText('Language DE').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
    expect(getByLabelText('Language EN').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false })
    );
  });

  it('is a no-op when tapping the already-active language', () => {
    const { getByLabelText, getByTestId } = renderToggle();
    fireEvent.press(getByLabelText('Language EN'));
    expect(getByTestId('lang').props.children).toBe('en');
  });
});
