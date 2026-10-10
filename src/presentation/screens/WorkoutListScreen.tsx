import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAnalytics } from '../../analytics/useAnalytics';
import { equipmentLabel, type MvpEquipment, type WorkoutTemplate } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton, BackButton } from '../components/Buttons';
import { EditorialIcon } from '../components/EditorialIcon';
import { FeaturedWorkoutCard } from '../components/FeaturedWorkoutCard';
import { SwipeToDeleteRow } from '../components/SwipeToDeleteRow';
import { WorkoutCard } from '../components/WorkoutCard';

type Props = {
  title: string;
  eyebrow: string;
  description?: string;
  emptyTitle?: string;
  emptyMessage: string;
  load: () => Promise<WorkoutTemplate[]>;
  onOpenWorkout: (workout: WorkoutTemplate) => void;
  onBack: () => void;
  onCreate?: () => void;
  showFeatured?: boolean;
  onStartWorkout?: (workout: WorkoutTemplate) => void;
  onDeleteWorkout?: (workout: WorkoutTemplate) => Promise<void>;
};

type VaultEquipmentFilter = 'all' | MvpEquipment;
const vaultEquipmentFilters: readonly VaultEquipmentFilter[] = ['all', 'bodyweight', 'kettlebell'];

export function WorkoutListScreen({ title, eyebrow, description, emptyTitle = 'Nothing here yet.', emptyMessage, load, onOpenWorkout, onBack, onCreate, showFeatured = false, onStartWorkout, onDeleteWorkout }: Props) {
  const analytics = useAnalytics();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [equipmentFilter, setEquipmentFilter] = useState<VaultEquipmentFilter>('all');

  useEffect(() => {
    load().then((loaded) => {
      setWorkouts(loaded);
      setFeaturedIndex(0);
      analytics.capture('workout_list_loaded', {
        list: showFeatured ? 'vault' : 'library',
        workout_count: loaded.length
      });
    }).catch((error) => analytics.error('workout list load failed', error, {
      list: showFeatured ? 'vault' : 'library'
    }));
  }, [analytics, load, showFeatured]);

  const visibleWorkouts = showFeatured && equipmentFilter !== 'all'
    ? workouts.filter((workout) => workout.equipment === equipmentFilter)
    : workouts;
  const featuredWorkout = showFeatured ? visibleWorkouts[featuredIndex] : null;
  const remainingWorkouts = featuredWorkout
    ? visibleWorkouts.filter((workout) => workout.id !== featuredWorkout.id)
    : visibleWorkouts;
  const selectEquipmentFilter = (filter: VaultEquipmentFilter) => {
    if (filter === equipmentFilter) return;
    analytics.capture('vault_equipment_filter_changed', {
      from_equipment: equipmentFilter,
      to_equipment: filter
    });
    setEquipmentFilter(filter);
    setFeaturedIndex(0);
  };
  const refreshWorkout = () => {
    if (visibleWorkouts.length > 1) {
      const nextIndex = (featuredIndex + 1) % visibleWorkouts.length;
      analytics.capture('vault_featured_refreshed', {
        equipment_filter: equipmentFilter,
        previous_workout_id: visibleWorkouts[featuredIndex]?.id,
        next_workout_id: visibleWorkouts[nextIndex]?.id
      });
      setFeaturedIndex(nextIndex);
    }
  };

  const confirmDelete = (workout: WorkoutTemplate) => {
    Alert.alert(
      'Delete workout?',
      `${workout.name} will be permanently removed from My Workouts. Your completed history will stay intact.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!onDeleteWorkout) return;
            try {
              await onDeleteWorkout(workout);
              analytics.capture('saved_workout_deleted', {
                workout_id: workout.id,
                equipment: workout.equipment,
                intensity: workout.intensity
              });
              setWorkouts((current) => current.filter((item) => item.id !== workout.id));
            } catch (error) {
              analytics.error('saved workout deletion failed', error, { workout_id: workout.id });
              Alert.alert('Could not delete workout', 'Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderWorkout = (workout: WorkoutTemplate) => {
    const card = <WorkoutCard workout={workout} onPress={() => onOpenWorkout(workout)} />;
    return onDeleteWorkout ? (
      <SwipeToDeleteRow
        key={workout.id}
        accessibilityLabel={`Delete ${workout.name} from saved workouts`}
        onDelete={() => confirmDelete(workout)}
      >
        {card}
      </SwipeToDeleteRow>
    ) : <View key={workout.id}>{card}</View>;
  };

  return (
    <AppScreen title={title} eyebrow={eyebrow} left={<BackButton onPress={onBack} />}>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onCreate && workouts.length ? (
        <>
          <ActionButton onPress={onCreate}>Build a workout</ActionButton>
          <Text style={styles.sectionLabel}>YOUR WORKOUTS</Text>
        </>
      ) : null}
      {showFeatured && workouts.length ? (
        <View accessibilityRole="tablist" style={styles.filterBar}>
          {vaultEquipmentFilters.map((filter) => {
            const selected = filter === equipmentFilter;
            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                key={filter}
                onPress={() => selectEquipmentFilter(filter)}
                style={[styles.filterOption, selected && styles.filterOptionSelected]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {filter === 'all' ? 'All' : equipmentLabel(filter)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {featuredWorkout && onStartWorkout ? (
        <>
          <View style={styles.featuredHeader}>
            <Pressable accessibilityRole="button" onPress={refreshWorkout} hitSlop={8} style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshPressed]}>
              <Text style={styles.refresh}>Refresh</Text>
            </Pressable>
          </View>
          <FeaturedWorkoutCard workout={featuredWorkout} onStart={() => onStartWorkout(featuredWorkout)} />
          <Text style={styles.sectionLabel}>MORE WORKOUTS</Text>
          {remainingWorkouts.map(renderWorkout)}
        </>
      ) : workouts.length ? workouts.map(renderWorkout) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><EditorialIcon color={colors.text} name="build" size={38} /></View>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyCopy}>{emptyMessage}</Text>
          {onCreate ? <ActionButton onPress={onCreate}>Build a workout</ActionButton> : null}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  description: { color: colors.textMuted, fontSize: 15, lineHeight: 21, marginTop: -spacing.sm },
  filterBar: { alignSelf: 'flex-start', backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flexDirection: 'row', padding: 3 },
  filterOption: { borderRadius: radii.pill, justifyContent: 'center', minHeight: 36, paddingHorizontal: spacing.md },
  filterOptionSelected: { backgroundColor: colors.text },
  filterText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  filterTextSelected: { color: colors.onPrimary },
  featuredHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' },
  sectionLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  refreshButton: { alignItems: 'center', backgroundColor: 'transparent', borderColor: colors.primary, borderRadius: radii.sm, borderWidth: 1.5, paddingHorizontal: spacing.md, paddingVertical: 6 },
  refreshPressed: { backgroundColor: colors.surfaceRaised, opacity: 0.72 },
  refresh: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 64, gap: spacing.md },
  emptyIcon: { alignItems: 'center', backgroundColor: '#FFC83D', borderColor: colors.text, borderRadius: 36, borderWidth: 2, height: 72, justifyContent: 'center', width: 72 },
  emptyTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  emptyCopy: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 }
});
