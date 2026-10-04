import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import type { WorkoutSession } from '../../domain/session';
import type { VideoWorkout } from '../../domain/videoWorkout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { VideoWorkoutCard } from '../components/VideoWorkoutCard';

type Props = {
  container: AppContainer;
  onCreate: () => void;
  onVault: () => void;
  onSaved: () => void;
  onHistory: () => void;
  onResume: (session: WorkoutSession) => void;
};

export function HomeScreen(props: Props) {
  const [dailyWorkout, setDailyWorkout] = useState<VideoWorkout | null>(null);
  const [active, setActive] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    Promise.all([props.container.videoWorkoutOfDay.getForDate(), props.container.sessions.getActiveSession()]).then(([video, session]) => {
      setDailyWorkout(video);
      setActive(session);
    });
  }, [props.container]);

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout>;
    const scheduleNextDay = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnightTimer = setTimeout(() => {
        props.container.videoWorkoutOfDay.getForDate().then(setDailyWorkout);
        scheduleNextDay();
      }, nextDay.getTime() - now.getTime() + 100);
    };

    scheduleNextDay();
    return () => clearTimeout(midnightTimer);
  }, [props.container]);

  const openDailyWorkout = async () => {
    if (!dailyWorkout) return;
    try {
      await Linking.openURL(dailyWorkout.youtubeUrl);
    } catch {
      Alert.alert('Could not open YouTube', 'Please check your connection and try again.');
    }
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

      {dailyWorkout ? (
        <View style={styles.section}>
          <VideoWorkoutCard workout={dailyWorkout} onOpen={() => void openDailyWorkout()} />
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
  resume: { backgroundColor: colors.surfaceRaised, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumeKicker: { color: colors.work, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  resumeTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.xs },
  resumeAction: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionTile: { width: '48%', flexGrow: 1, minHeight: 118, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, justifyContent: 'space-between' },
  actionIcon: { color: colors.primary, fontSize: 28, fontWeight: '700' },
  actionTitle: { color: colors.text, fontSize: 16, lineHeight: 20, fontWeight: '900', marginTop: spacing.md }
});
