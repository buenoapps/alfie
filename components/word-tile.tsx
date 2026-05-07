import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type WordTileProps = {
  word: string;
  emoji: string;
  color: string;
  onPress: () => void;
};

export function WordTile({ word, emoji, color, onPress }: WordTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Word ${word}`}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 12, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      style={[styles.tile, { backgroundColor: color }, animatedStyle]}
    >
      <View style={styles.shadow} />
      <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      <ThemedText style={styles.word}>{word}</ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 8,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  shadow: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    right: 10,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  emoji: {
    fontSize: 36,
    lineHeight: 48,
  },
  word: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
    color: Palette.ink,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
