import { useRef, type PropsWithChildren } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

const ACTION_WIDTH = 96;

type Props = PropsWithChildren<{
  accessibilityLabel: string;
  onDelete: () => void;
}>;

export function SwipeToDeleteRow({ accessibilityLabel, children, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const gestureStart = useRef(0);

  const settle = (value: number) => {
    Animated.spring(translateX, {
      toValue: value,
      useNativeDriver: true,
      tension: 90,
      friction: 12
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => (
      Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy)
    ),
    onPanResponderGrant: () => {
      translateX.stopAnimation((value) => { gestureStart.current = value; });
    },
    onPanResponderMove: (_, gesture) => {
      translateX.setValue(Math.max(-ACTION_WIDTH, Math.min(0, gestureStart.current + gesture.dx)));
    },
    onPanResponderRelease: (_, gesture) => {
      const position = Math.max(-ACTION_WIDTH, Math.min(0, gestureStart.current + gesture.dx));
      settle(position < -ACTION_WIDTH / 2 || gesture.vx < -0.35 ? -ACTION_WIDTH : 0);
    },
    onPanResponderTerminate: () => settle(0)
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
