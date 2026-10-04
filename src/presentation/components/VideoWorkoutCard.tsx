import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { experienceConfig } from '../../config/experienceConfig';
import type { VideoWorkout } from '../../domain/videoWorkout';
import { equipmentEmoji, equipmentLabel, type Equipment } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { formatDuration, formatVideoFocus } from '../formatters';
import { ActionButton } from './Buttons';

type Props = {
  workout: VideoWorkout;
  onOpen: () => void;
};

export function VideoWorkoutCard({ workout, onOpen }: Props) {
  if (experienceConfig.dailyWorkoutCardStyle === 'simple') {
    return <SimpleVideoWorkoutCard workout={workout} onOpen={onOpen} />;
  }

  return <EditorialVideoWorkoutCard workout={workout} onOpen={onOpen} />;
}

const equipmentArtwork: Record<Equipment, ImageSourcePropType> = {
  kettlebell: require('../../../assets/equipment/kettlebell.png'),
  dumbbells: require('../../../assets/equipment/dumbbells.png'),
  bands: require('../../../assets/equipment/bands.png'),
  bodyweight: require('../../../assets/equipment/bodyweight.png')
};

function EditorialVideoWorkoutCard({ workout, onOpen }: Props) {
  return (
    <View style={styles.editorialCard}>
      <EditorialPattern />
      <View style={styles.editorialMetadata}>
        <View style={[styles.editorialBadge, styles.equipmentBadge]}>
          <Text style={styles.editorialBadgeText}>{equipmentLabel(workout.equipment)}</Text>
        </View>
        <View style={[styles.editorialBadge, styles.durationBadge]}>
          <Text style={styles.editorialBadgeText}>{formatDuration(workout.durationSeconds)}</Text>
        </View>
      </View>

      <View style={styles.editorialBody}>
        <View style={styles.editorialCopy}>
          <Text style={styles.editorialChannel} numberOfLines={3}>{workout.channelName}</Text>
          <Text style={styles.editorialFocus} numberOfLines={2}>{formatVideoFocus(workout.focus)}</Text>
        </View>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={equipmentArtwork[workout.equipment]}
          style={styles.equipmentArtwork}
        />
      </View>

      <ActionButton onPress={onOpen} style={styles.editorialButton}>
        {equipmentEmoji(workout.equipment)} Workout of the day →
      </ActionButton>
    </View>
  );
}

function EditorialPattern() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.sunDisc} />
      <View style={styles.dotGrid}>
        {Array.from({ length: 12 }, (_, index) => <View key={index} style={styles.patternDot} />)}
      </View>
    </View>
  );
}

function SimpleVideoWorkoutCard({ workout, onOpen }: Props) {
  return (
    <View style={styles.simpleCard}>
      <View style={styles.simpleMetadata}>
        <View style={styles.simpleBadge}>
          <Text style={styles.simpleBadgeText}>{equipmentLabel(workout.equipment)}</Text>
        </View>
        <View style={styles.simpleBadge}>
          <Text style={styles.simpleBadgeText}>{formatDuration(workout.durationSeconds)}</Text>
        </View>
      </View>
      <Text style={styles.simpleChannel} numberOfLines={2}>{workout.channelName}</Text>
      <Text style={styles.simpleFocus} numberOfLines={2}>{formatVideoFocus(workout.focus)}</Text>
      <ActionButton onPress={onOpen} style={styles.simpleButton}>
        {equipmentEmoji(workout.equipment)} Workout of the day →
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  editorialCard: {
    backgroundColor: '#FFC83D',
    borderColor: '#153936',
    borderRadius: radii.lg,
    borderWidth: 3,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg
  },
  editorialMetadata: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    zIndex: 1
  },
  editorialBadge: {
    borderColor: '#153936',
    borderRadius: radii.pill,
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: 7
  },
  equipmentBadge: { backgroundColor: '#79D6CF' },
  durationBadge: { backgroundColor: '#FFF7E3' },
  editorialBadgeText: {
    color: '#153936',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  editorialBody: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 122,
    zIndex: 1
  },
  editorialCopy: { flex: 1, gap: spacing.sm, paddingRight: spacing.xs },
  editorialChannel: {
    color: '#153936',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 24
  },
  editorialFocus: { color: '#315B56', fontSize: 14, fontWeight: '700', lineHeight: 19 },
  equipmentArtwork: { height: 126, marginRight: -10, width: 126 },
  editorialButton: {
    borderColor: '#153936',
    borderWidth: 2,
    marginTop: spacing.xs,
    zIndex: 1
  },
  sunDisc: {
    backgroundColor: '#FF963D',
    borderColor: '#153936',
    borderRadius: 110,
    borderWidth: 2,
    height: 180,
    opacity: 0.72,
    position: 'absolute',
    right: -54,
    top: 62,
    width: 180
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    opacity: 0.32,
    position: 'absolute',
    right: 16,
    top: 18,
    width: 58
  },
  patternDot: { backgroundColor: '#153936', borderRadius: 3, height: 4, width: 4 },
  simpleCard: {
    backgroundColor: colors.featuredSurface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm
  },
  simpleMetadata: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  simpleBadge: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  simpleBadgeText: {
    color: colors.onFeatured,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  simpleChannel: {
    color: colors.onFeatured,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    marginTop: spacing.xs
  },
  simpleFocus: { color: colors.featuredMuted, fontSize: 14, lineHeight: 20 },
  simpleButton: { marginTop: spacing.sm }
});
