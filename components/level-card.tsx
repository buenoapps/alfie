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

export type LevelCardProps = {
  emoji: string;
  title: string;
  subtitle: string;
  background: string;
  border: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function LevelCard({
  emoji,
  title,
  subtitle,
  background,
  border,
  onPress,
  accessibilityLabel,
}: LevelCardProps) {
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
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 12, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      style={[
        styles.card,
        { backgroundColor: background, borderColor: border },
        animatedStyle,
      ]}
    >
      <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      <View style={styles.text}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 3,
    gap: 16,
    shadowColor: Palette.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 76,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: Palette.ink,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.inkSoft,
  },
});
