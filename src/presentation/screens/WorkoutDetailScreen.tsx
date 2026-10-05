import { Image, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton, BackButton } from '../components/Buttons';
import { equipmentArtwork } from '../equipmentArtwork';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onBack: () => void;
  onStart: () => void;
  onEdit: () => void;
};

export function WorkoutDetailScreen({ workout, onBack, onStart, onEdit }: Props) {
  return (
    <AppScreen eyebrow={workout.isVault ? 'The Vault' : 'My Workouts'} title="Workout details" left={<BackButton onPress={onBack} />}>
      <View style={styles.heroCard}>
        <View style={styles.badges}>
          <View style={styles.badge}><Text style={styles.badgeText}>{equipmentLabel(workout.equipment)}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{formatDuration(workoutDurationSeconds(workout))}</Text></View>
          <View style={[styles.badge, styles.intensityBadge]}><Text style={styles.intensityText}>{intensityLabel(workout.intensity)}</Text></View>
        </View>

        <View style={styles.heroContent}>
          <View style={styles.heroCopy}>
            <Text style={styles.workoutName}>{workout.emoji ? `${workout.emoji} ` : ''}{workout.name}</Text>
            <View style={styles.primaryMetrics}>
              <View style={styles.primaryMetric}><Text style={styles.primaryValue}>{workout.rounds}</Text><Text style={styles.primaryLabel}>Rounds</Text></View>
              <Text style={styles.metricDivider}>·</Text>
              <View style={styles.primaryMetric}><Text style={styles.primaryValue}>{workout.exercises.length}</Text><Text style={styles.primaryLabel}>Movements</Text></View>
            </View>
          </View>
          <View style={styles.visual}>
            <View style={styles.artworkDisc} />
            <Image accessibilityIgnoresInvertColors resizeMode="contain" source={equipmentArtwork[workout.equipment]} style={styles.artwork} />
          </View>
        </View>
      </View>

      <View style={styles.intervalSection}>
        <Text style={styles.sectionHeading}>TIMING</Text>
        <View style={styles.intervalMetrics}>
          <View style={styles.intervalMetric}><Text style={styles.intervalValue}>{workout.startupSeconds}s</Text><Text style={styles.intervalLabel}>Get ready</Text></View>
          <View style={styles.intervalMetric}><Text style={styles.intervalValue}>{workout.workSeconds}s</Text><Text style={styles.intervalLabel}>Work</Text></View>
          <View style={styles.intervalMetric}><Text style={styles.intervalValue}>{workout.restSeconds}s</Text><Text style={styles.intervalLabel}>Breathe</Text></View>
        </View>
      </View>

      <View style={styles.exerciseBox}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.sectionHeading}>MOVEMENTS</Text>
          <Text style={styles.exerciseCount}>{workout.exercises.length} total</Text>
        </View>
        {workout.exercises.map((exercise, index) => (
          <View key={exercise.id} style={[styles.exerciseRow, index === workout.exercises.length - 1 && styles.lastExerciseRow]}>
            <View style={styles.exerciseNumber}><Text style={styles.exerciseNumberText}>{index + 1}</Text></View>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </View>
        ))}
      </View>

      <ActionButton onPress={onStart}>Start workout</ActionButton>
      {!workout.isVault ? <ActionButton variant="secondary" onPress={onEdit}>Edit workout</ActionButton> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: colors.featuredSurface, borderColor: '#153936', borderRadius: radii.lg, borderWidth: 2, gap: spacing.sm, overflow: 'hidden', padding: spacing.lg },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, zIndex: 1 },
  badge: { backgroundColor: '#FFFFFF', borderColor: '#153936', borderRadius: radii.pill, borderWidth: 1.5, paddingHorizontal: spacing.md, paddingVertical: 7 },
  intensityBadge: { borderColor: colors.primary },
  badgeText: { color: '#153936', fontSize: 12, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  intensityText: { color: '#153936', fontSize: 12, fontWeight: '900' },
  heroContent: { alignItems: 'flex-start', flexDirection: 'row', minHeight: 130 },
  heroCopy: { alignSelf: 'stretch', flex: 1, gap: spacing.lg, justifyContent: 'center', zIndex: 1 },
  primaryMetrics: { alignItems: 'baseline', flexDirection: 'row', gap: 6 },
  primaryMetric: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  primaryValue: { color: '#153936', fontSize: 28, fontWeight: '900', lineHeight: 32 },
  primaryLabel: { color: '#315B56', fontSize: 9, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  metricDivider: { color: colors.primary, fontSize: 26, fontWeight: '900' },
  workoutName: { color: '#153936', fontSize: 20, fontWeight: '900', lineHeight: 25 },
  visual: { height: 130, marginRight: -12, position: 'relative', width: 112 },
  artworkDisc: { backgroundColor: '#FFE7A3', borderColor: '#153936', borderRadius: 54, borderWidth: 2, height: 106, position: 'absolute', right: -5, top: 8, width: 106 },
  artwork: { height: 112, position: 'absolute', right: -7, top: 3, width: 112 },
  intervalSection: { gap: spacing.sm },
  sectionHeading: { color: colors.work, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  intervalMetrics: { flexDirection: 'row', gap: spacing.sm },
  intervalMetric: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, padding: spacing.md },
  intervalValue: { color: colors.text, fontSize: 22, fontWeight: '900' },
  intervalLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  exerciseBox: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 2, borderColor: '#153936', padding: spacing.lg },
  exerciseHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  exerciseCount: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastExerciseRow: { borderBottomWidth: 0 },
  exerciseNumber: { alignItems: 'center', backgroundColor: '#FFE7A3', borderRadius: 15, height: 30, justifyContent: 'center', width: 30 },
  exerciseNumberText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  exerciseName: { color: colors.text, fontSize: 17, fontWeight: '700' }
});
