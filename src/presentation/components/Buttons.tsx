import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = PropsWithChildren<{
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: ViewStyle;
}>;

export function ActionButton({ children, onPress, disabled, variant = 'primary', style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.label, variant !== 'primary' && styles.secondaryLabel, variant === 'danger' && styles.dangerLabel]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Back"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
    >
      <Text style={styles.backArrow}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radii.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceRaised },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
  label: { color: colors.onPrimary, fontSize: 16, fontWeight: '800' },
  secondaryLabel: { color: colors.text },
  dangerLabel: { color: colors.danger },
  back: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  backPressed: { backgroundColor: colors.surfaceRaised, transform: [{ scale: 0.96 }] },
  backArrow: { color: colors.text, fontSize: 24, lineHeight: 27, fontWeight: '700' }
});
