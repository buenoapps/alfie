import { render } from '@testing-library/react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

describe('IconSymbol (non-iOS fallback)', () => {
  it('renders mapped icon names without crashing', () => {
    expect(() =>
      render(<IconSymbol name="house.fill" color="#000" size={24} />)
    ).not.toThrow();
    expect(() =>
      render(<IconSymbol name="speaker.wave.2.fill" color="#000" size={24} />)
    ).not.toThrow();
    expect(() =>
      render(<IconSymbol name="chevron.left" color="#000" size={24} />)
    ).not.toThrow();
    expect(() =>
      render(<IconSymbol name="chevron.right" color="#000" size={24} />)
    ).not.toThrow();
  });
});
