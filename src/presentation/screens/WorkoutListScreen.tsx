import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutTemplate } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { WorkoutCard } from '../components/WorkoutCard';

type Props = {
  title: string;
  eyebrow: string;
  emptyMessage: string;
  load: () => Promise<WorkoutTemplate[]>;
  onOpenWorkout: (workout: WorkoutTemplate) => void;
  onBack: () => void;
  onCreate?: () => void;
};

export function WorkoutListScreen({ title, eyebrow, emptyMessage, load, onOpenWorkout, onBack, onCreate }: Props) {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    load().then(setWorkouts);
  }, [load]);

  return (
    <AppScreen title={title} eyebrow={eyebrow} right={<ActionButton variant="ghost" onPress={onBack}>Back</ActionButton>}>
      {workouts.length ? workouts.map((workout) => (
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
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80, gap: spacing.md },
  emptyTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  emptyCopy: { color: colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 }
});
