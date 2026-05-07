import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, renderHook, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AudioProvider, useAudio } from '@/contexts/audio';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}

describe('AudioProvider / useAudio', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
  });

  it('defaults to enabled', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    expect(result.current.enabled).toBe(true);
  });

  it('flips when setEnabled is called', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => result.current.setEnabled(false));
    expect(result.current.enabled).toBe(false);
  });

  it('round-trips via toggle', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(true);
  });

  it('persists changes to AsyncStorage', () => {
    const { result } = renderHook(() => useAudio(), { wrapper });
    act(() => result.current.setEnabled(false));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('alfie:audio-enabled', '0');
    act(() => result.current.setEnabled(true));
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('alfie:audio-enabled', '1');
  });

  it('hydrates a stored "0" value on mount', async () => {
    await AsyncStorage.setItem('alfie:audio-enabled', '0');
    const { result } = renderHook(() => useAudio(), { wrapper });
    await waitFor(() => expect(result.current.enabled).toBe(false));
  });

  it('ignores unrecognized stored values', async () => {
    await AsyncStorage.setItem('alfie:audio-enabled', 'maybe');
    const { result } = renderHook(() => useAudio(), { wrapper });
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled());
    expect(result.current.enabled).toBe(true);
  });

  it('throws when used outside the provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    function Bare() {
      useAudio();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/AudioProvider/);
    consoleError.mockRestore();
  });

  it('renders consumer state', () => {
    function Probe() {
      const { enabled } = useAudio();
      return <Text testID="audio">{enabled ? 'on' : 'off'}</Text>;
    }
    const { getByTestId } = render(
      <AudioProvider>
        <Probe />
      </AudioProvider>
    );
    expect(getByTestId('audio').props.children).toBe('on');
  });
});
