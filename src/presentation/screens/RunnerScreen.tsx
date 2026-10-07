import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, AppState, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import { useAnalytics } from '../../analytics/useAnalytics';
import { currentExercise, nextExercise, remainingMs, workoutBellCue, type WorkoutSession } from '../../domain/session';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { EditorialIcon } from '../components/EditorialIcon';

type Props = {
  container: AppContainer;
  initialSession: WorkoutSession;
  onBell: () => void;
  onComplete: (session: WorkoutSession) => void;
  onEnd: () => void;
};

export function RunnerScreen({ container, initialSession, onBell, onComplete, onEnd }: Props) {
  const analytics = useAnalytics();
  const { height: windowHeight } = useWindowDimensions();
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
      if (transitionWasCurrent && workoutBellCue(previousTimer, updated.timerState)) onBell();
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
  const resting = session.timerState.phase === 'rest';
  const phaseColor = paused ? colors.paused : preparing ? colors.primary : session.timerState.phase === 'rest' ? colors.rest : colors.work;
  const remainingSeconds = Math.ceil(remaining / 1000);
  const nextMovement = preparing ? exercise : upcoming;
  const compact = windowHeight < 760;

  const togglePause = async () => {
    const updated = paused ? await container.sessions.resume(session) : await container.sessions.pause(session);
    analytics.capture(paused ? 'workout_resumed' : 'workout_paused', {
      session_id: session.id,
      workout_id: session.workoutTemplateId,
      phase: session.timerState.phase,
      round: session.timerState.roundIndex + 1,
      movement: session.timerState.exerciseIndex + 1
    });
    setSession(updated);
    setNow(Date.now());
  };

  const skip = async () => {
    const updated = await container.sessions.skip(session);
    analytics.capture('workout_interval_skipped', {
      session_id: session.id,
      workout_id: session.workoutTemplateId,
      phase: session.timerState.phase,
      round: session.timerState.roundIndex + 1,
      movement: session.timerState.exerciseIndex + 1
    });
    if (workoutBellCue(session.timerState, updated.timerState)) onBell();
    setSession(updated);
    setNow(Date.now());
    if (updated.status === 'completed') onComplete(updated);
  };

  const confirmEnd = () => {
    Alert.alert('End workout?', 'This attempt will be kept in History as ended early.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End workout', style: 'destructive', onPress: async () => {
        await container.sessions.end(session);
        analytics.capture('workout_ended_early', {
          session_id: session.id,
          workout_id: session.workoutTemplateId,
          phase: session.timerState.phase,
          round: session.timerState.roundIndex + 1,
          movement: session.timerState.exerciseIndex + 1
        });
        onEnd();
      } }
    ]);
  };

  return (
    <AppScreen scroll={false}>
      <View style={styles.runner}>
        <View style={styles.status}>
          <Text style={[styles.phase, { color: phaseColor }]}>{paused ? 'PAUSED' : preparing ? 'GET READY' : session.timerState.phase.toUpperCase()}</Text>
          <Text style={styles.round}>{preparing ? 'Workout starts in' : `Round ${session.timerState.roundIndex + 1} of ${session.workoutSnapshot.rounds}`}</Text>
        </View>

        <View accessibilityLabel={`${remainingSeconds} seconds remaining`} style={[styles.timerDial, compact && styles.timerDialCompact, { borderColor: phaseColor }]}>
          <View style={[styles.timerDialInner, compact && styles.timerDialInnerCompact, { borderColor: `${phaseColor}33` }]}>
            <Text style={[styles.timer, compact && styles.timerCompact, { color: phaseColor }]}>{remainingSeconds}</Text>
            <Text style={styles.secondsLabel}>seconds</Text>
          </View>
        </View>

        <View style={[styles.movementArea, compact && styles.movementAreaCompact]}>
          {resting ? (
            <BreathingGuide active={!paused} color={phaseColor} compact={compact} />
          ) : (
            <Text style={styles.exercise}>{preparing ? 'Get set.' : exercise?.name}</Text>
          )}
        </View>

        <View style={styles.nextCard}>
          <View style={styles.nextHeadingRow}>
            <Text style={styles.nextKicker}>{nextMovement ? (preparing ? 'FIRST UP' : 'UP NEXT') : 'FINISH LINE'}</Text>
            <EditorialIcon color={nextMovement ? colors.primary : colors.text} name={nextMovement ? 'arrow' : 'finish'} size={22} />
          </View>
          <Text style={styles.nextMovement}>{nextMovement?.name ?? 'Last interval — finish strong'}</Text>
          <Text style={styles.nextHint}>{preparing ? 'Get your space and equipment ready.' : resting ? 'Start when the bell rings.' : 'Coming after this interval.'}</Text>
        </View>

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

function BreathingGuide({ active, color, compact }: { active: boolean; color: string; compact: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const [cue, setCue] = useState<'Inhale' | 'Exhale'>('Inhale');

  useEffect(() => {
    if (!active) {
      pulse.stopAnimation();
      return;
    }

    setCue('Inhale');
    pulse.setValue(0);
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 3_500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 3_500, useNativeDriver: true })
    ]));
    animation.start();
    const cueTimer = setInterval(() => setCue((current) => current === 'Inhale' ? 'Exhale' : 'Inhale'), 3_500);

    return () => {
      clearInterval(cueTimer);
      animation.stop();
    };
  }, [active, pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1.08] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.32, 0.62] });

  return (
    <View accessibilityLabel={`${cue}. Follow the expanding and contracting circle.`} style={[styles.breathingGuide, compact && styles.breathingGuideCompact]}>
      <Animated.View style={[styles.breathingPulse, compact && styles.breathingPulseCompact, { backgroundColor: color, opacity, transform: [{ scale }] }]} />
      <View style={[styles.breathingCenter, compact && styles.breathingCenterCompact, { borderColor: color }]}>
        <Text style={[styles.breathingCue, { color }]}>{active ? cue : 'Paused'}</Text>
        <Text style={styles.breathingHint}>{cue === 'Inhale' ? 'breathe in' : 'breathe out'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  runner: { alignItems: 'center', flex: 1, justifyContent: 'space-between', paddingBottom: spacing.md },
  status: { alignItems: 'center' },
  phase: { fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  round: { color: colors.textMuted, fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
  timerDial: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 104,
    borderWidth: 12,
    height: 208,
    justifyContent: 'center',
    marginVertical: spacing.md,
    shadowColor: '#153936',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    width: 208
  },
  timerDialInner: {
    alignItems: 'center',
    borderRadius: 88,
    borderWidth: 2,
    height: 166,
    justifyContent: 'center',
    width: 166
  },
  timerDialCompact: { borderRadius: 86, borderWidth: 10, height: 172, marginVertical: spacing.sm, width: 172 },
  timerDialInnerCompact: { borderRadius: 70, height: 138, width: 138 },
  timer: { fontSize: 72, fontWeight: '900', letterSpacing: -4, lineHeight: 76 },
  timerCompact: { fontSize: 58, lineHeight: 62 },
  secondsLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  movementArea: { alignItems: 'center', justifyContent: 'center', minHeight: 118, width: '100%' },
  movementAreaCompact: { minHeight: 92 },
  exercise: { color: colors.text, fontSize: 30, fontWeight: '900', lineHeight: 36, textAlign: 'center' },
  breathingGuide: { alignItems: 'center', height: 118, justifyContent: 'center', width: 150 },
  breathingGuideCompact: { height: 92 },
  breathingPulse: { borderRadius: 72, height: 132, position: 'absolute', width: 132 },
  breathingPulseCompact: { borderRadius: 54, height: 102, width: 102 },
  breathingCenter: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 48,
    borderWidth: 2,
    height: 96,
    justifyContent: 'center',
    width: 96
  },
  breathingCenterCompact: { borderRadius: 40, height: 78, width: 78 },
  breathingCue: { fontSize: 18, fontWeight: '900' },
  breathingHint: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  nextCard: {
    backgroundColor: '#FFF1C4',
    borderColor: '#153936',
    borderRadius: radii.md,
    borderWidth: 2,
    padding: spacing.md,
    width: '100%'
  },
  nextHeadingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  nextKicker: { color: '#315B56', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  nextMovement: { color: '#153936', fontSize: 22, fontWeight: '900', lineHeight: 27, marginTop: spacing.xs },
  nextHint: { color: '#55706D', fontSize: 13, fontWeight: '700', marginTop: spacing.xs },
  controls: { gap: spacing.md, marginTop: spacing.lg, width: '100%' },
  secondaryControls: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 }
});
