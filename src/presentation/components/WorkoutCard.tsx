import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { equipmentArtwork } from '../equipmentArtwork';
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

      <View style={styles.contentRow}>
        <View style={styles.copy}>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{workout.rounds}</Text>
              <Text style={styles.metricLabel}>Rounds</Text>
            </View>
            <Text style={styles.metricDivider}>·</Text>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{workout.exercises.length}</Text>
              <Text style={styles.metricLabel}>Movements</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>{workout.emoji ? `${workout.emoji} ` : ''}{workout.name}</Text>
          <Text style={styles.intensity}>{intensityLabel(workout.intensity)}</Text>
        </View>

        <View style={styles.visual}>
          <View style={styles.artworkDisc} />
          <Image accessibilityIgnoresInvertColors resizeMode="contain" source={equipmentArtwork[workout.equipment]} style={styles.artwork} />
          <View style={styles.arrowButton}><Text style={styles.arrow}>→</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.featuredSurface, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 2, borderColor: '#153936', gap: spacing.md, overflow: 'hidden' },
  pressed: { opacity: 0.78 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: { backgroundColor: '#FFF7E3', borderColor: '#153936', borderRadius: radii.pill, borderWidth: 1.5, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  equipmentBadge: { backgroundColor: '#79D6CF' },
  badgeText: { color: '#153936', fontSize: 10, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  contentRow: { alignItems: 'center', flexDirection: 'row', minHeight: 112 },
  copy: { flex: 1, gap: spacing.sm, zIndex: 1 },
  metrics: { alignItems: 'baseline', flexDirection: 'row', gap: 6 },
  metric: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  metricValue: { color: '#153936', fontSize: 24, fontWeight: '900', lineHeight: 28 },
  metricLabel: { color: '#315B56', fontSize: 9, fontWeight: '900', letterSpacing: 0.3, textTransform: 'uppercase' },
  metricDivider: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  title: { color: '#153936', fontSize: 16, fontWeight: '900', lineHeight: 20 },
  intensity: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: spacing.xs },
  visual: { height: 112, marginRight: -8, position: 'relative', width: 104 },
  artworkDisc: { backgroundColor: '#FFC83D', borderColor: '#153936', borderRadius: 48, borderWidth: 2, height: 92, position: 'absolute', right: -9, top: 2, width: 92 },
  artwork: { height: 94, position: 'absolute', right: -7, top: 0, width: 94 },
  arrowButton: { alignItems: 'center', backgroundColor: colors.primary, borderColor: '#153936', borderRadius: 17, borderWidth: 2, bottom: 0, height: 34, justifyContent: 'center', position: 'absolute', right: 0, width: 34 },
  arrow: { color: colors.onPrimary, fontSize: 20, fontWeight: '900', lineHeight: 21 },
  saved: { color: colors.primary, fontSize: 18 },
});
