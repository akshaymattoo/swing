import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import { dailyWorkoutIndex, orderWorkoutsForDailyRotation } from '../../application/dailyWorkout';
import type { WorkoutSession } from '../../domain/session';
import type { WorkoutTemplate } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { FeaturedWorkoutCard } from '../components/FeaturedWorkoutCard';

type Props = {
  container: AppContainer;
  onStartWorkout: (workout: WorkoutTemplate) => void;
  onCreate: () => void;
  onVault: () => void;
  onSaved: () => void;
  onHistory: () => void;
  onResume: (session: WorkoutSession) => void;
};

export function HomeScreen(props: Props) {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [active, setActive] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    Promise.all([props.container.workouts.listVault(), props.container.sessions.getActiveSession()]).then(([vault, session]) => {
      const dailyRotation = orderWorkoutsForDailyRotation(vault);
      setWorkouts(dailyRotation);
      setFeaturedIndex(dailyWorkoutIndex(new Date(), dailyRotation.length));
      setActive(session);
    });
  }, [props.container]);

  useEffect(() => {
    if (workouts.length === 0) return;

    let midnightTimer: ReturnType<typeof setTimeout>;
    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnightTimer = setTimeout(() => {
        setFeaturedIndex(dailyWorkoutIndex(new Date(), workouts.length));
        scheduleNextDay();
      }, nextDay.getTime() - now.getTime() + 100);
    };

    scheduleNextDay();
    return () => clearTimeout(midnightTimer);
  }, [workouts.length]);

  const quickStart = workouts[featuredIndex] ?? null;
  const refreshWorkout = () => {
    if (workouts.length > 1) setFeaturedIndex((current) => (current + 1) % workouts.length);
  };

  return (
    <AppScreen eyebrow="Swing" title={'What are we\ndoing today?'}>
      {active ? (
        <Pressable style={styles.resume} onPress={() => props.onResume(active)}>
          <View>
            <Text style={styles.resumeKicker}>Workout in progress</Text>
            <Text style={styles.resumeTitle}>{active.workoutSnapshot.emoji} {active.workoutSnapshot.name}</Text>
          </View>
          <Text style={styles.resumeAction}>Resume →</Text>
        </Pressable>
      ) : null}

      {quickStart ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>WORKOUT OF THE DAY</Text>
            <Pressable accessibilityRole="button" onPress={refreshWorkout} hitSlop={8}>
              <Text style={styles.refresh}>↻ Refresh</Text>
            </Pressable>
          </View>
          <FeaturedWorkoutCard workout={quickStart} onStart={() => props.onStartWorkout(quickStart)} />
        </View>
      ) : null}

      <View style={styles.actionGrid}>
        <Pressable style={styles.actionTile} onPress={props.onCreate}>
          <Text style={styles.actionIcon}>＋</Text>
          <Text style={styles.actionTitle}>Create workout</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={props.onVault}>
          <Text style={styles.actionIcon}>◆</Text>
          <Text style={styles.actionTitle}>Open The Vault</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={props.onSaved}>
          <Text style={styles.actionIcon}>♥</Text>
          <Text style={styles.actionTitle}>Saved workouts</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={props.onHistory}>
          <Text style={styles.actionIcon}>↺</Text>
          <Text style={styles.actionTitle}>History</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  refresh: { color: colors.work, fontSize: 14, fontWeight: '800' },
  resume: { backgroundColor: colors.surfaceRaised, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumeKicker: { color: colors.work, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  resumeTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.xs },
  resumeAction: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionTile: { width: '48%', flexGrow: 1, minHeight: 118, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, justifyContent: 'space-between' },
  actionIcon: { color: colors.primary, fontSize: 28, fontWeight: '700' },
  actionTitle: { color: colors.text, fontSize: 16, lineHeight: 20, fontWeight: '900', marginTop: spacing.md }
});
