import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SpeakerButtonProps = {
  onPress: () => void;
  size?: number;
  muted?: boolean;
};

export function SpeakerButton({ onPress, size = 72, muted = false }: SpeakerButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={muted ? 'Unmute audio' : 'Mute audio'}
      accessibilityState={{ selected: muted }}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      style={[
        styles.button,
        muted && styles.buttonMuted,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    >
      <IconSymbol
        name={muted ? 'speaker.slash.fill' : 'speaker.wave.2.fill'}
        size={size * 0.5}
        color={Palette.white}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.honeyDark,
    borderWidth: 3,
    borderColor: Palette.white,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonMuted: {
    backgroundColor: Palette.inkSoft,
  },
});
