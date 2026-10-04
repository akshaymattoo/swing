import { StyleSheet, Text, View } from 'react-native';

import type { VideoWorkout } from '../../domain/videoWorkout';
import { equipmentEmoji, equipmentLabel } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { formatDuration } from '../formatters';
import { ActionButton } from './Buttons';

type Props = {
  workout: VideoWorkout;
  onOpen: () => void;
};

export function VideoWorkoutCard({ workout, onOpen }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.metadata}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{equipmentLabel(workout.equipment)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatDuration(workout.durationSeconds)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={3}>{workout.title}</Text>
      <Text style={styles.channel} numberOfLines={1}>{workout.channelName}</Text>
      <Text style={styles.focus} numberOfLines={2}>{workout.focus}</Text>
      <ActionButton onPress={onOpen} style={styles.button}>
        {equipmentEmoji(workout.equipment)} Workout of the day →
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.featuredSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm
  },
  metadata: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  badge: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  badgeText: {
    color: colors.onFeatured,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  title: {
    color: colors.onFeatured,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    marginTop: spacing.xs
  },
  channel: { color: colors.featuredMuted, fontSize: 13, fontWeight: '700' },
  focus: { color: colors.featuredMuted, fontSize: 12, lineHeight: 17 },
  button: { marginTop: spacing.sm }
});
