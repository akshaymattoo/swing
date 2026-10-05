import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { equipmentLabel, intensityLabel, workoutDurationSeconds } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { equipmentArtwork } from '../equipmentArtwork';
import { EditorialIcon } from './EditorialIcon';
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
          <View style={styles.badge}><Text style={styles.badgeText}>{equipmentLabel(workout.equipment)}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{formatDuration(workoutDurationSeconds(workout))}</Text></View>
          <View style={[styles.badge, styles.intensityBadge]}><Text style={styles.intensityText}>{intensityLabel(workout.intensity)}</Text></View>
        </View>
        {workout.isSaved && !workout.isVault ? <EditorialIcon name="workouts" size={20} /> : null}
      </View>

      <View style={styles.contentRow}>
        <View style={styles.copy}>
          <Text style={styles.title} numberOfLines={2}>{workout.emoji ? `${workout.emoji} ` : ''}{workout.name}</Text>
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
        </View>

        <View style={styles.visual}>
          <View style={styles.artworkDisc} />
          <Image accessibilityIgnoresInvertColors resizeMode="contain" source={equipmentArtwork[workout.equipment]} style={styles.artwork} />
          <View style={styles.arrowButton}><EditorialIcon color={colors.onPrimary} name="arrow" size={18} /></View>
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
  intensityBadge: { borderColor: colors.primary },
  badgeText: { color: '#153936', fontSize: 12, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  intensityText: { color: '#153936', fontSize: 12, fontWeight: '900' },
  contentRow: { alignItems: 'center', flexDirection: 'row', minHeight: 112 },
  copy: { flex: 1, gap: spacing.sm, zIndex: 1 },
  metrics: { alignItems: 'baseline', flexDirection: 'row', gap: 6 },
  metric: { alignItems: 'baseline', flexDirection: 'row', gap: 4 },
  metricValue: { color: '#153936', fontSize: 24, fontWeight: '900', lineHeight: 28 },
  metricLabel: { color: '#315B56', fontSize: 9, fontWeight: '900', letterSpacing: 0.3, textTransform: 'uppercase' },
  metricDivider: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  title: { color: '#153936', fontSize: 16, fontWeight: '900', lineHeight: 20 },
  visual: { height: 112, marginRight: -8, position: 'relative', width: 104 },
  artworkDisc: { backgroundColor: '#FFE7A3', borderColor: '#153936', borderRadius: 48, borderWidth: 2, height: 92, position: 'absolute', right: -9, top: 2, width: 92 },
  artwork: { height: 94, position: 'absolute', right: -7, top: 0, width: 94 },
  arrowButton: { alignItems: 'center', backgroundColor: colors.primary, borderColor: '#153936', borderRadius: 17, borderWidth: 2, bottom: 0, height: 34, justifyContent: 'center', position: 'absolute', right: 0, width: 34 },
});
