import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { Palette } from '@/constants/theme';

const AnimatedG = Animated.createAnimatedComponent(G);

export type AlfieProps = {
  size?: number;
  letter?: string;
  holdingBlock?: boolean;
  flap?: boolean;
  bob?: boolean;
};

export function Alfie({
  size = 200,
  letter,
  holdingBlock = true,
  flap = true,
  bob = true,
}: AlfieProps) {
  const bobY = useSharedValue(0);
  const wingScale = useSharedValue(1);

  useEffect(() => {
    if (bob) {
      bobY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    } else {
      bobY.value = 0;
    }
  }, [bob, bobY]);

  useEffect(() => {
    if (flap) {
      wingScale.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: 110, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 110, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    } else {
      wingScale.value = 1;
    }
  }, [flap, wingScale]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }],
  }));

  const wingProps = useAnimatedProps(() => ({
    scaleY: wingScale.value,
  }));

  const blockX = 142;
  const blockY = 92;

  return (
    <Animated.View style={[styles.wrap, { width: size, height: size }, containerStyle]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFD86B" />
            <Stop offset="1" stopColor={Palette.honey} />
          </LinearGradient>
          <LinearGradient id="wingGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E8F5FE" stopOpacity="0.95" />
            <Stop offset="1" stopColor={Palette.sky} stopOpacity="0.85" />
          </LinearGradient>
        </Defs>

        <AnimatedG originX={100} originY={70} animatedProps={wingProps}>
          <Ellipse
            cx={70}
            cy={70}
            rx={28}
            ry={36}
            fill="url(#wingGradient)"
            stroke="#9FCDEA"
            strokeWidth={1.5}
            transform="rotate(-20 70 70)"
          />
          <Ellipse
            cx={130}
            cy={70}
            rx={28}
            ry={36}
            fill="url(#wingGradient)"
            stroke="#9FCDEA"
            strokeWidth={1.5}
            transform="rotate(20 130 70)"
          />
        </AnimatedG>

        <Path
          d="M85 55 Q80 35 70 30"
          stroke={Palette.stripe}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M115 55 Q120 35 130 30"
          stroke={Palette.stripe}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={70} cy={28} r={4} fill={Palette.stripe} />
        <Circle cx={130} cy={28} r={4} fill={Palette.stripe} />

        <Circle
          cx={100}
          cy={110}
          r={55}
          fill="url(#bodyGradient)"
          stroke={Palette.honeyDark}
          strokeWidth={2}
        />

        <Path
          d="M58 95 Q100 85 142 95 Q140 102 100 102 Q60 102 58 95 Z"
          fill={Palette.stripe}
          opacity={0.92}
        />
        <Path
          d="M62 125 Q100 117 138 125 Q136 132 100 132 Q64 132 62 125 Z"
          fill={Palette.stripe}
          opacity={0.92}
        />

        <Circle cx={78} cy={108} r={6} fill="#FF8FB1" opacity={0.55} />
        <Circle cx={122} cy={108} r={6} fill="#FF8FB1" opacity={0.55} />

        <Circle cx={84} cy={100} r={5.5} fill={Palette.ink} />
        <Circle cx={116} cy={100} r={5.5} fill={Palette.ink} />
        <Circle cx={86} cy={98} r={1.8} fill={Palette.white} />
        <Circle cx={118} cy={98} r={1.8} fill={Palette.white} />

        <Path
          d="M92 116 Q100 124 108 116"
          stroke={Palette.ink}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />

        <Path d="M100 165 L96 173 L104 173 Z" fill={Palette.stripe} />

        {holdingBlock && (
          <G>
            <Rect
              x={blockX}
              y={blockY}
              width={48}
              height={48}
              rx={10}
              ry={10}
              fill={Palette.blossom}
              stroke={Palette.blossomDark}
              strokeWidth={2}
            />
            <Rect
              x={blockX + 4}
              y={blockY + 4}
              width={40}
              height={8}
              rx={3}
              fill={Palette.white}
              opacity={0.35}
            />
            {letter ? (
              <SvgText
                x={blockX + 24}
                y={blockY + 35}
                fontSize="30"
                fontWeight="800"
                fill={Palette.white}
                textAnchor="middle"
              >
                {letter.toUpperCase()}
              </SvgText>
            ) : null}
          </G>
        )}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
