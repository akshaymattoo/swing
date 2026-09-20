import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { ActionButton } from './Buttons';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onStart: () => void;
};

export function FeaturedWorkoutCard({ workout, onStart }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>
        {equipmentLabel(workout.equipment)} · {formatDuration(workoutDurationSeconds(workout))}
      </Text>
      <Text style={styles.title}>
        {workout.emoji ? `${workout.emoji} ` : ''}{workout.name}
      </Text>
      <Text style={styles.meta}>
        {intensityLabel(workout.intensity)} · {workout.rounds} rounds · {workout.exercises.length} movements
      </Text>
      <ActionButton onPress={onStart} style={styles.startButton}>Start workout</ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.featuredSurface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.xs
  },
  kicker: {
    color: colors.onFeatured,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  title: {
    color: colors.onFeatured,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: spacing.xs
  },
  meta: {
    color: colors.featuredMuted,
    fontSize: 14,
    lineHeight: 20
  },
  startButton: { marginTop: spacing.md }
});
