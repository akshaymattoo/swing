import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '../../theme/colors';

const pieces = [
  { x: -148, y: 230, delay: 0, color: colors.primary, rotate: '240deg' },
  { x: -112, y: 170, delay: 70, color: '#087D74', rotate: '170deg' },
  { x: -76, y: 260, delay: 20, color: '#FFC83D', rotate: '300deg' },
  { x: -38, y: 195, delay: 110, color: '#A9D8D2', rotate: '210deg' },
  { x: 4, y: 245, delay: 35, color: colors.primary, rotate: '280deg' },
  { x: 44, y: 180, delay: 90, color: '#087D74', rotate: '200deg' },
  { x: 82, y: 255, delay: 10, color: '#FFC83D', rotate: '320deg' },
  { x: 122, y: 205, delay: 125, color: '#A9D8D2', rotate: '250deg' },
  { x: 154, y: 235, delay: 55, color: colors.primary, rotate: '330deg' },
  { x: -132, y: 300, delay: 130, color: '#FFC83D', rotate: '260deg' },
  { x: -58, y: 315, delay: 80, color: '#087D74', rotate: '190deg' },
  { x: 25, y: 305, delay: 145, color: '#A9D8D2', rotate: '300deg' },
  { x: 98, y: 320, delay: 60, color: colors.primary, rotate: '230deg' },
] as const;

export function CompletionConfetti() {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  if (reduceMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, index) => <ConfettiPiece index={index} key={index} {...piece} />)}
    </View>
  );
}

function ConfettiPiece({
  color,
  delay,
  index,
  rotate,
  x,
  y,
}: (typeof pieces)[number] & { index: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      delay,
      duration: 1450,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: color,
          borderRadius: index % 3 === 0 ? 5 : 1,
          opacity: progress.interpolate({ inputRange: [0, 0.08, 0.78, 1], outputRange: [0, 1, 1, 0] }),
          transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
            { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rotate] }) },
            { scale: progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.5, 1, 0.8] }) },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: {
    height: 13,
    left: '50%',
    position: 'absolute',
    top: '18%',
    width: 8,
  },
});
