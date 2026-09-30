import { StyleSheet, Text, View } from 'react-native';

import type { VideoWorkout } from '../../domain/videoWorkout';
import { equipmentLabel } from '../../domain/workout';
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
      <Text style={styles.kicker}>
        {equipmentLabel(workout.equipment)} · {formatDuration(workout.durationSeconds)}
      </Text>
      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.channel}>{workout.channelName}</Text>
      <Text style={styles.focus} numberOfLines={2}>{workout.focus}</Text>
      <ActionButton onPress={onOpen} style={styles.button}>Watch and work out</ActionButton>
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
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: spacing.xs
  },
  channel: { color: colors.featuredMuted, fontSize: 14, fontWeight: '800', marginTop: spacing.xs },
  focus: { color: colors.featuredMuted, fontSize: 13, lineHeight: 19 },
  button: { marginTop: spacing.md }
});
