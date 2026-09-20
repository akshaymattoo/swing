import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onPress: () => void;
  featured?: boolean;
};

export function WorkoutCard({ workout, onPress, featured = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, featured && styles.featured, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.kicker, featured && styles.featuredText]}>
          {equipmentLabel(workout.equipment)} · {formatDuration(workoutDurationSeconds(workout))}
        </Text>
        {workout.isSaved ? <Text style={styles.saved}>♥</Text> : null}
      </View>
      <Text style={[styles.title, featured && styles.featuredText]}>
        {workout.emoji ? `${workout.emoji} ` : ''}{workout.name}
      </Text>
      <Text style={[styles.meta, featured && styles.featuredMuted]}>
        {intensityLabel(workout.intensity)} · {workout.rounds} rounds · {workout.exercises.length} movements
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  featured: { backgroundColor: colors.surfaceRaised, borderColor: colors.surfaceRaised, padding: spacing.xl },
  pressed: { opacity: 0.78 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.work, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 23, fontWeight: '900', marginTop: spacing.xs },
  meta: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  saved: { color: colors.primary, fontSize: 18 },
  featuredText: { color: colors.text },
  featuredMuted: { color: colors.textMuted }
});
