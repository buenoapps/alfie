import { render } from '@testing-library/react-native';

import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
  it('renders its children', () => {
    const { getByText } = render(<ThemedText>Hello Alfie</ThemedText>);
    expect(getByText('Hello Alfie')).toBeTruthy();
  });

  it('applies the title style for type="title"', () => {
    const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
    const node = getByText('Title');
    const flat = flatten(node.props.style);
    expect(flat.fontSize).toBe(36);
    expect(flat.fontWeight).toBe('800');
  });

  it('applies the subtitle style for type="subtitle"', () => {
    const { getByText } = render(<ThemedText type="subtitle">Sub</ThemedText>);
    const flat = flatten(getByText('Sub').props.style);
    expect(flat.fontSize).toBe(22);
  });

  it('applies the caption style for type="caption"', () => {
    const { getByText } = render(<ThemedText type="caption">Cap</ThemedText>);
    const flat = flatten(getByText('Cap').props.style);
    expect(flat.fontSize).toBe(14);
  });

  it('forwards lightColor as the resolved color', () => {
    const { getByText } = render(
      <ThemedText lightColor="#FF0000">Red</ThemedText>
    );
    const flat = flatten(getByText('Red').props.style);
    expect(flat.color).toBe('#FF0000');
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
