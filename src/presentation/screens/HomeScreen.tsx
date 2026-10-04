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

      <Pressable
        accessibilityHint="Browse workouts by equipment and intensity"
        accessibilityRole="button"
        onPress={props.onVault}
        style={({ pressed }) => [styles.vaultCard, pressed && styles.pressed]}
      >
        <View pointerEvents="none" style={styles.vaultDecoration}>
          <View style={styles.vaultOrbit} />
          <View style={styles.vaultDiamond}><View style={styles.vaultDiamondCenter} /></View>
          <View style={styles.vaultDot} />
        </View>
        <View style={styles.vaultCopy}>
          <Text style={styles.vaultKicker}>WANT SOMETHING DIFFERENT?</Text>
          <Text style={styles.vaultTitle}>Explore the Vault</Text>
          <Text style={styles.vaultDescription}>Choose by equipment, intensity, or duration.</Text>
          <View style={styles.vaultAction}>
            <Text style={styles.vaultActionText}>Browse workouts</Text>
            <Text style={styles.vaultActionArrow}>→</Text>
          </View>
        </View>
      </Pressable>

      <Text style={styles.utilityHeading}>YOUR WORKOUTS</Text>
      <View style={styles.actionGrid}>
        <Pressable style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]} onPress={props.onCreate}>
          <Text style={styles.actionIcon}>＋</Text>
          <Text style={styles.actionTitle}>Build</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]} onPress={props.onSaved}>
          <Text style={styles.actionIcon}>♥</Text>
          <Text style={styles.actionTitle}>My Workouts</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]} onPress={props.onHistory}>
          <Text style={styles.actionIcon}>↺</Text>
          <Text style={styles.actionTitle}>Progress</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  resume: { backgroundColor: colors.surfaceRaised, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumeKicker: { color: colors.work, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  resumeTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.xs },
  resumeAction: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  vaultCard: {
    backgroundColor: colors.work,
    borderColor: '#153936',
    borderRadius: radii.lg,
    borderWidth: 3,
    minHeight: 190,
    overflow: 'hidden',
    padding: spacing.lg
  },
  vaultCopy: { maxWidth: '72%', zIndex: 1 },
  vaultKicker: { color: '#BDE8E2', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  vaultTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', letterSpacing: -0.5, lineHeight: 30, marginTop: spacing.sm },
  vaultDescription: { color: '#D4F0EC', fontSize: 14, fontWeight: '600', lineHeight: 19, marginTop: spacing.xs },
  vaultAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderColor: '#153936',
    borderRadius: radii.pill,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9
  },
  vaultActionText: { color: colors.onPrimary, fontSize: 13, fontWeight: '900' },
  vaultActionArrow: { color: colors.onPrimary, fontSize: 18, fontWeight: '900', lineHeight: 18 },
  vaultDecoration: { bottom: 0, position: 'absolute', right: 0, top: 0, width: 128 },
  vaultOrbit: {
    borderColor: '#79D6CF',
    borderRadius: 80,
    borderWidth: 3,
    height: 150,
    opacity: 0.55,
    position: 'absolute',
    right: -42,
    top: 21,
    width: 150
  },
  vaultDiamond: {
    alignItems: 'center',
    backgroundColor: '#FFC83D',
    borderColor: '#153936',
    borderRadius: 8,
    borderWidth: 3,
    height: 68,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 56,
    transform: [{ rotate: '45deg' }],
    width: 68
  },
  vaultDiamondCenter: { backgroundColor: colors.primary, borderColor: '#153936', borderRadius: 5, borderWidth: 2, height: 24, width: 24 },
  vaultDot: { backgroundColor: '#FFC83D', borderRadius: 7, bottom: 25, height: 14, position: 'absolute', right: 84, width: 14 },
  utilityHeading: { color: colors.textMuted, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginTop: spacing.xs },
  actionGrid: { flexDirection: 'row', gap: spacing.sm },
  actionTile: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 92,
    padding: spacing.md
  },
  actionIcon: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  actionTitle: { color: colors.text, fontSize: 14, fontWeight: '900', lineHeight: 18, marginTop: spacing.sm }
});
