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
  const actions = (
    <View style={styles.actions}>
      <ActionButton onPress={onStart} style={styles.startAction}>Start workout</ActionButton>
      {!workout.isVault ? <ActionButton variant="secondary" onPress={onEdit} style={styles.editAction}>Edit</ActionButton> : null}
    </View>
  );

  return (
    <AppScreen eyebrow={workout.isVault ? 'The Vault' : 'My Workouts'} title="Workout details" left={<BackButton onPress={onBack} />} footer={actions}>
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
        <View style={styles.exerciseGrid}>
          {workout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseNumber}><Text style={styles.exerciseNumberText}>{index + 1}</Text></View>
              <Text numberOfLines={2} style={styles.exerciseName}>{exercise.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: { backgroundColor: colors.featuredSurface, borderColor: '#153936', borderRadius: radii.lg, borderWidth: 2, gap: spacing.sm, overflow: 'hidden', padding: spacing.md },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, zIndex: 1 },
  badge: { backgroundColor: '#FFFFFF', borderColor: '#153936', borderRadius: radii.pill, borderWidth: 1.5, paddingHorizontal: spacing.md, paddingVertical: 5 },
  intensityBadge: { borderColor: colors.primary },
  badgeText: { color: '#153936', fontSize: 12, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  intensityText: { color: '#153936', fontSize: 12, fontWeight: '900' },
  heroContent: { alignItems: 'flex-start', flexDirection: 'row', minHeight: 92 },
  heroCopy: { alignSelf: 'stretch', flex: 1, gap: spacing.md, justifyContent: 'center', zIndex: 1 },
  primaryMetrics: { alignItems: 'baseline', flexDirection: 'row', gap: 6 },
  primaryMetric: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  primaryValue: { color: '#153936', fontSize: 24, fontWeight: '900', lineHeight: 28 },
  primaryLabel: { color: '#315B56', fontSize: 9, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  metricDivider: { color: colors.primary, fontSize: 22, fontWeight: '900' },
  workoutName: { color: '#153936', fontSize: 18, fontWeight: '900', lineHeight: 22 },
  visual: { height: 92, marginRight: -8, position: 'relative', width: 88 },
  artworkDisc: { backgroundColor: '#FFE7A3', borderColor: '#153936', borderRadius: 42, borderWidth: 2, height: 82, position: 'absolute', right: 0, top: 4, width: 82 },
  artwork: { height: 88, position: 'absolute', right: -2, top: 0, width: 88 },
  intervalSection: { gap: spacing.sm },
  sectionHeading: { color: colors.work, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  intervalMetrics: { flexDirection: 'row', gap: spacing.sm },
  intervalMetric: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, padding: spacing.sm },
  intervalValue: { color: colors.text, fontSize: 20, fontWeight: '900' },
  intervalLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  exerciseBox: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 2, borderColor: '#153936', padding: spacing.md },
  exerciseHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  exerciseCount: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  exerciseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  exerciseRow: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, minHeight: 42, padding: spacing.sm, width: '48.5%' },
  exerciseNumber: { alignItems: 'center', backgroundColor: '#FFE7A3', borderRadius: 12, height: 24, justifyContent: 'center', width: 24 },
  exerciseNumberText: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  exerciseName: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '800', lineHeight: 16 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  startAction: { flex: 2 },
  editAction: { flex: 1 }
});
