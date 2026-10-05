import { Image, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { radii, spacing } from '../../theme/spacing';
import { equipmentArtwork } from '../equipmentArtwork';
import { ActionButton } from './Buttons';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onStart: () => void;
};

export function FeaturedWorkoutCard({ workout, onStart }: Props) {
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.sunDisc} />
      <View style={styles.badges}>
        <View style={styles.badge}><Text style={styles.badgeText}>{equipmentLabel(workout.equipment)}</Text></View>
        <View style={[styles.badge, styles.durationBadge]}><Text style={styles.badgeText}>{formatDuration(workoutDurationSeconds(workout))}</Text></View>
      </View>

      <View style={styles.showcase}>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{workout.rounds}</Text>
            <Text style={styles.metricLabel}>Rounds</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{workout.exercises.length}</Text>
            <Text style={styles.metricLabel}>Movements</Text>
          </View>
        </View>
        <Image accessibilityIgnoresInvertColors resizeMode="contain" source={equipmentArtwork[workout.equipment]} style={styles.artwork} />
      </View>

      <Text style={styles.nameLabel}>WORKOUT</Text>
      <Text style={styles.title} numberOfLines={2}>{workout.emoji ? `${workout.emoji} ` : ''}{workout.name}</Text>
      <Text style={styles.intensity}>{intensityLabel(workout.intensity)}</Text>
      <ActionButton onPress={onStart} style={styles.startButton}>Start workout</ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFE7A3',
    borderColor: '#153936',
    borderRadius: radii.lg,
    borderWidth: 3,
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.lg
  },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, zIndex: 1 },
  badge: { backgroundColor: '#FFFFFF', borderColor: '#153936', borderRadius: radii.pill, borderWidth: 2, paddingHorizontal: spacing.md, paddingVertical: 7 },
  durationBadge: { backgroundColor: '#FFF7E3' },
  badgeText: {
    color: '#153936',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  showcase: { alignItems: 'center', flexDirection: 'row', minHeight: 112, zIndex: 1 },
  metrics: { flex: 1, flexDirection: 'row', gap: spacing.sm },
  metric: {
    alignItems: 'center',
    backgroundColor: '#FFF7E3',
    borderColor: '#153936',
    borderRadius: radii.md,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    minHeight: 78,
    paddingHorizontal: spacing.xs
  },
  metricValue: { color: '#153936', fontSize: 30, fontWeight: '900', lineHeight: 34 },
  metricLabel: { color: '#315B56', fontSize: 10, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  artwork: { height: 116, marginRight: -12, width: 116 },
  nameLabel: { color: '#55706D', fontSize: 10, fontWeight: '900', letterSpacing: 1.2, zIndex: 1 },
  title: {
    color: '#153936',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    zIndex: 1
  },
  intensity: { color: '#315B56', fontSize: 13, fontWeight: '800', zIndex: 1 },
  startButton: { borderColor: '#153936', borderWidth: 2, marginTop: spacing.xs, zIndex: 1 },
  sunDisc: {
    backgroundColor: '#FFD574',
    borderColor: '#153936',
    borderRadius: 100,
    borderWidth: 2,
    height: 170,
    opacity: 0.68,
    position: 'absolute',
    right: -60,
    top: 42,
    width: 170
  }
});
