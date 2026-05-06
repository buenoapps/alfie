import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';

describe('ThemedView', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>inside</Text>
      </ThemedView>
    );
    expect(getByText('inside')).toBeTruthy();
  });

  it('forwards lightColor as the resolved background color', () => {
    const tree = render(
      <ThemedView lightColor="#ABCDEF">
        <Text>x</Text>
      </ThemedView>
    );
    const root = tree.UNSAFE_getByType(View);
    const flat = flatten(root.props.style);
    expect(flat.backgroundColor).toBe('#ABCDEF');
  });
});

function flatten(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acc, s) => Object.assign(acc, flatten(s)),
      {}
    );
  }
  return style as Record<string, unknown>;
}
