import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton, BackButton } from '../components/Buttons';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onBack: () => void;
  onStart: () => void;
  onSave: () => void;
};

export function WorkoutDetailScreen({ workout, onBack, onStart, onSave }: Props) {
  return (
    <AppScreen eyebrow={workout.isVault ? 'The Vault' : 'Saved workout'} title={`${workout.emoji ?? ''} ${workout.name}`.trim()} left={<BackButton onPress={onBack} />}>
      <Text style={styles.summary}>
        {equipmentLabel(workout.equipment)} · {intensityLabel(workout.intensity)} · {formatDuration(workoutDurationSeconds(workout))}
      </Text>

      <View style={styles.metrics}>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.rounds}</Text><Text style={styles.metricLabel}>Rounds</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.startupSeconds}s</Text><Text style={styles.metricLabel}>Start</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.workSeconds}s</Text><Text style={styles.metricLabel}>Work</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.restSeconds}s</Text><Text style={styles.metricLabel}>Rest</Text></View>
      </View>

      <View style={styles.exerciseBox}>
        <Text style={styles.exerciseHeading}>MOVEMENTS</Text>
        {workout.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseRow}>
            <Text style={styles.exerciseNumber}>{index + 1}</Text>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </View>
        ))}
      </View>

      <ActionButton onPress={onStart}>Start workout</ActionButton>
      {!workout.isSaved ? <ActionButton variant="secondary" onPress={onSave}>Save to My Workouts</ActionButton> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summary: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: -spacing.sm },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, backgroundColor: colors.surfaceRaised, borderRadius: radii.md, padding: spacing.md, alignItems: 'center' },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '900' },
  metricLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 2 },
  exerciseBox: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  exerciseHeading: { color: colors.work, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: spacing.sm },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  exerciseNumber: { color: colors.primary, fontSize: 15, fontWeight: '900', width: 22 },
  exerciseName: { color: colors.text, fontSize: 17, fontWeight: '700' }
});
