import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { FeaturedWorkoutCard } from '../components/FeaturedWorkoutCard';
import { WorkoutCard } from '../components/WorkoutCard';

type Props = {
  title: string;
  eyebrow: string;
  emptyMessage: string;
  load: () => Promise<WorkoutTemplate[]>;
  onOpenWorkout: (workout: WorkoutTemplate) => void;
  onBack: () => void;
  onCreate?: () => void;
  showFeatured?: boolean;
  onStartWorkout?: (workout: WorkoutTemplate) => void;
};

export function WorkoutListScreen({ title, eyebrow, emptyMessage, load, onOpenWorkout, onBack, onCreate, showFeatured = false, onStartWorkout }: Props) {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    load().then((loaded) => {
      setWorkouts(loaded);
      setFeaturedIndex(0);
    });
  }, [load]);

  const featuredWorkout = showFeatured ? workouts[featuredIndex] : null;
  const remainingWorkouts = featuredWorkout
    ? workouts.filter((workout) => workout.id !== featuredWorkout.id)
    : workouts;
  const refreshWorkout = () => {
    if (workouts.length > 1) setFeaturedIndex((current) => (current + 1) % workouts.length);
  };

  return (
    <AppScreen title={title} eyebrow={eyebrow} right={<ActionButton variant="ghost" onPress={onBack}>Back</ActionButton>}>
      {featuredWorkout && onStartWorkout ? (
        <>
          <View style={styles.featuredHeader}>
            <Text style={styles.sectionLabel}>FEATURED WORKOUT</Text>
            <Pressable accessibilityRole="button" onPress={refreshWorkout} hitSlop={8}>
              <Text style={styles.refresh}>↻ Refresh</Text>
            </Pressable>
          </View>
          <FeaturedWorkoutCard workout={featuredWorkout} onStart={() => onStartWorkout(featuredWorkout)} />
          <Text style={styles.sectionLabel}>MORE FROM THE VAULT</Text>
          {remainingWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} onPress={() => onOpenWorkout(workout)} />
          ))}
        </>
      ) : workouts.length ? workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onPress={() => onOpenWorkout(workout)} />
        )) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing here yet.</Text>
          <Text style={styles.emptyCopy}>{emptyMessage}</Text>
          {onCreate ? <ActionButton onPress={onCreate}>Create a workout</ActionButton> : null}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  featuredHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  refresh: { color: colors.work, fontSize: 14, fontWeight: '800' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  emptyCopy: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 }
});
