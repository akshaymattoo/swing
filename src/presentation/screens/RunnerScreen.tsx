import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import { currentExercise, nextExercise, remainingMs, roundBellCue, type WorkoutSession } from '../../domain/session';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { formatCountdown } from '../formatters';

type Props = {
  container: AppContainer;
  initialSession: WorkoutSession;
  onBell: () => void;
  onComplete: (session: WorkoutSession) => void;
  onEnd: () => void;
};

export function RunnerScreen({ container, initialSession, onBell, onComplete, onEnd }: Props) {
  const [session, setSession] = useState(initialSession);
  const [now, setNow] = useState(Date.now());
  const transitioning = useRef(false);

  const refresh = useCallback(async (time = Date.now()) => {
    if (transitioning.current) return;
    transitioning.current = true;
    try {
      const previousTimer = session.timerState;
      const updated = await container.sessions.refresh(session, time);
      const transitionWasCurrent = previousTimer.intervalEndsAt !== null && time - previousTimer.intervalEndsAt < 1_500;
      if (transitionWasCurrent && roundBellCue(session.workoutSnapshot, previousTimer, updated.timerState)) onBell();
      setSession(updated);
      setNow(time);
      if (updated.status === 'completed') onComplete(updated);
    } finally {
      transitioning.current = false;
    }
  }, [container, onBell, onComplete, session]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh(Date.now());
    });
    return () => { clearInterval(interval); subscription.remove(); };
  }, [refresh]);

  const remaining = remainingMs(session.timerState, now);
  useEffect(() => {
    if (remaining === 0 && session.timerState.phase !== 'complete' && session.timerState.pausedRemainingMs === null) {
      void refresh(now);
    }
  }, [now, refresh, remaining, session.timerState.pausedRemainingMs, session.timerState.phase]);

  const paused = session.timerState.pausedRemainingMs !== null;
  const exercise = currentExercise(session.workoutSnapshot, session.timerState);
  const upcoming = nextExercise(session.workoutSnapshot, session.timerState);
  const preparing = session.timerState.phase === 'prepare';
  const phaseColor = paused ? colors.paused : preparing ? colors.primary : session.timerState.phase === 'rest' ? colors.rest : colors.work;

  const togglePause = async () => {
    const updated = paused ? await container.sessions.resume(session) : await container.sessions.pause(session);
    setSession(updated);
    setNow(Date.now());
  };

  const skip = async () => {
    const updated = await container.sessions.skip(session);
    if (roundBellCue(session.workoutSnapshot, session.timerState, updated.timerState)) onBell();
    setSession(updated);
    setNow(Date.now());
    if (updated.status === 'completed') onComplete(updated);
  };

  const confirmEnd = () => {
    Alert.alert('End workout?', 'This attempt will be kept in History as ended early.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End workout', style: 'destructive', onPress: async () => { await container.sessions.end(session); onEnd(); } }
    ]);
  };

  return (
    <AppScreen scroll={false}>
      <View style={styles.runner}>
        <Text style={[styles.phase, { color: phaseColor }]}>{paused ? 'PAUSED' : preparing ? 'GET READY' : session.timerState.phase.toUpperCase()}</Text>
        <Text style={styles.round}>{preparing ? 'Workout starts in' : `Round ${session.timerState.roundIndex + 1} of ${session.workoutSnapshot.rounds}`}</Text>
        <Text style={[styles.timer, { color: phaseColor }]}>{formatCountdown(remaining)}</Text>
        <Text style={styles.exercise}>{preparing ? `First up: ${exercise?.name}` : session.timerState.phase === 'rest' ? 'Breathe.' : exercise?.name}</Text>
        <Text style={styles.next}>{preparing ? 'Get your space and equipment ready.' : upcoming ? `Next: ${upcoming.name}` : 'Last interval — finish strong'}</Text>

        <View style={styles.controls}>
          <ActionButton onPress={togglePause}>{paused ? 'Resume' : 'Pause'}</ActionButton>
          <View style={styles.secondaryControls}>
            <ActionButton variant="secondary" onPress={skip} style={styles.half}>Skip</ActionButton>
            <ActionButton variant="danger" onPress={confirmEnd} style={styles.half}>End</ActionButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  runner: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: spacing.xxl },
  phase: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  round: { color: colors.textMuted, fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
  timer: { fontSize: 86, lineHeight: 100, fontWeight: '900', letterSpacing: -5, marginTop: spacing.xl },
  exercise: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900', textAlign: 'center', marginTop: spacing.md },
  next: { color: colors.textMuted, fontSize: 16, marginTop: spacing.sm, textAlign: 'center' },
  controls: { width: '100%', marginTop: 64, gap: spacing.md },
  secondaryControls: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 }
});
