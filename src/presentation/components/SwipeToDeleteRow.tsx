import { useRef, type PropsWithChildren } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { clampSwipePosition, swipeDeleteTarget } from './swipeToDelete';

const ACTION_WIDTH = 96;

type Props = PropsWithChildren<{
  accessibilityLabel: string;
  onDelete: () => void;
}>;

export function SwipeToDeleteRow({ accessibilityLabel, children, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const gestureStart = useRef(0);
  const currentPosition = useRef(0);

  const settle = (value: number) => {
    currentPosition.current = value;
    Animated.spring(translateX, {
      toValue: value,
      useNativeDriver: true,
      tension: 90,
      friction: 12
    }).start();
  };

  const shouldHandleSwipe = (_: unknown, gesture: { dx: number; dy: number }) => (
    Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy)
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: shouldHandleSwipe,
    onMoveShouldSetPanResponderCapture: shouldHandleSwipe,
    onPanResponderGrant: () => {
      translateX.stopAnimation((value) => {
        gestureStart.current = value;
        currentPosition.current = value;
      });
    },
    onPanResponderMove: (_, gesture) => {
      const position = clampSwipePosition(gestureStart.current + gesture.dx, ACTION_WIDTH);
      currentPosition.current = position;
      translateX.setValue(position);
    },
    onPanResponderRelease: (_, gesture) => {
      const position = clampSwipePosition(gestureStart.current + gesture.dx, ACTION_WIDTH);
      settle(swipeDeleteTarget(position, gesture.vx, ACTION_WIDTH));
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: () => settle(swipeDeleteTarget(currentPosition.current, 0, ACTION_WIDTH))
  });

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          <Text style={styles.deleteIcon}>⌫</Text>
          <Text style={styles.deleteLabel}>Delete</Text>
        </Pressable>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.foreground, { transform: [{ translateX }] }]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radii.md, overflow: 'hidden', backgroundColor: colors.danger },
  actionContainer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'flex-end' },
  deleteButton: { width: ACTION_WIDTH, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  pressed: { opacity: 0.72 },
  deleteIcon: { color: colors.onPrimary, fontSize: 21, fontWeight: '900' },
  deleteLabel: { color: colors.onPrimary, fontSize: 12, fontWeight: '800', marginTop: 2 },
  foreground: { backgroundColor: colors.background }
});
