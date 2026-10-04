import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { formatDuration } from '../formatters';

type Props = {
  workout: WorkoutTemplate;
  onPress: () => void;
};

export function WorkoutCard({ workout, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.badges}>
          <View style={[styles.badge, styles.equipmentBadge]}><Text style={styles.badgeText}>{equipmentLabel(workout.equipment)}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{formatDuration(workoutDurationSeconds(workout))}</Text></View>
        </View>
        {workout.isSaved ? <Text style={styles.saved}>♥</Text> : null}
      </View>
      <View style={styles.metrics}>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.rounds}</Text><Text style={styles.metricLabel}>Rounds</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{workout.exercises.length}</Text><Text style={styles.metricLabel}>Movements</Text></View>
      </View>
      <View style={styles.nameRow}>
        <View style={styles.nameCopy}>
          <Text style={styles.title} numberOfLines={2}>{workout.emoji ? `${workout.emoji} ` : ''}{workout.name}</Text>
          <Text style={styles.intensity}>{intensityLabel(workout.intensity)}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 2, borderColor: colors.border, gap: spacing.md },
  pressed: { opacity: 0.78 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: { backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  equipmentBadge: { backgroundColor: '#D8F2EE' },
  badgeText: { color: colors.text, fontSize: 10, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { alignItems: 'center', backgroundColor: '#FFF7E3', borderRadius: radii.md, flex: 1, paddingVertical: spacing.sm },
  metricValue: { color: colors.text, fontSize: 23, fontWeight: '900', lineHeight: 27 },
  metricLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  nameRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  nameCopy: { flex: 1 },
  title: { color: colors.text, fontSize: 16, fontWeight: '900', lineHeight: 20 },
  intensity: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: spacing.xs },
  arrow: { color: colors.primary, fontSize: 23, fontWeight: '900' },
  saved: { color: colors.primary, fontSize: 18 },
});
