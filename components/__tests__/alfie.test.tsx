import { render } from '@testing-library/react-native';

import { Alfie } from '@/components/alfie';

function renderedText(tree: ReturnType<typeof render>): string {
  return JSON.stringify(tree.toJSON());
}

describe('Alfie mascot', () => {
  it('renders without crashing at the default size', () => {
    expect(() => render(<Alfie />)).not.toThrow();
  });

  it('renders the letter on the block when provided', () => {
    const tree = render(<Alfie letter="A" />);
    expect(renderedText(tree)).toContain('"A"');
  });

  it('uppercases the letter prop on the block', () => {
    const tree = render(<Alfie letter="g" />);
    const dump = renderedText(tree);
    expect(dump).toContain('"G"');
    expect(dump).not.toContain('"g"');
  });

  it('omits the block (and its letter) when holdingBlock is false', () => {
    const tree = render(<Alfie letter="A" holdingBlock={false} />);
    expect(renderedText(tree)).not.toContain('"A"');
  });
});
