import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { PostHogProvider } from 'posthog-react-native';

import { useAnalytics } from './src/analytics/useAnalytics';
import { createAppContainer, type AppContainer } from './src/application/appContainer';
import { analyticsConfig } from './src/config/analyticsConfig';
import { appConfig } from './src/config/appConfig';
import type { WorkoutSession } from './src/domain/session';
import type { WorkoutTemplate } from './src/domain/workout';
import { colors } from './src/theme/colors';
import { spacing } from './src/theme/spacing';
import { bellSound } from './src/presentation/audio/bell';
import { BottomNav } from './src/presentation/components/BottomNav';
import { CompletionScreen } from './src/presentation/screens/CompletionScreen';
import { CreateWorkoutScreen } from './src/presentation/screens/CreateWorkoutScreen';
import { HistoryScreen } from './src/presentation/screens/HistoryScreen';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { RunnerScreen } from './src/presentation/screens/RunnerScreen';
import { WorkoutDetailScreen } from './src/presentation/screens/WorkoutDetailScreen';
import { WorkoutListScreen } from './src/presentation/screens/WorkoutListScreen';

type Route = 'home' | 'vault' | 'saved' | 'create' | 'edit' | 'detail' | 'runner' | 'complete' | 'history';

export default function App() {
  return (
    <PostHogProvider apiKey={analyticsConfig.apiKey} options={{ host: analyticsConfig.host }}>
      <SwingApp />
    </PostHogProvider>
  );
}

function SwingApp() {
  const analytics = useAnalytics();
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [route, setRoute] = useState<Route>('home');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const bellPlayer = useAudioPlayer(bellSound, {
    downloadFirst: true,
    keepAudioSessionActive: true,
    updateInterval: 100
  });
  const bellStatus = useAudioPlayerStatus(bellPlayer);
  const pendingBell = useRef(false);

  const playLoadedBell = useCallback(async () => {
    try {
      bellPlayer.volume = 1;
      bellPlayer.pause();
      await bellPlayer.seekTo(0);
      bellPlayer.play();
    } catch (error) {
      console.warn('Swing could not play the workout bell.', error);
      analytics.error('workout bell playback failed', error);
    }
  }, [analytics, bellPlayer]);

  const playBell = useCallback(() => {
    if (!bellStatus.isLoaded) {
      pendingBell.current = true;
      return;
    }
    pendingBell.current = false;
    void playLoadedBell();
  }, [bellStatus.isLoaded, playLoadedBell]);

  useEffect(() => {
    if (bellStatus.isLoaded && pendingBell.current) {
      pendingBell.current = false;
      void playLoadedBell();
    }
  }, [bellStatus.isLoaded, playLoadedBell]);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'doNotMix'
    }).catch((error) => {
      console.warn('Swing could not configure workout audio.', error);
      analytics.error('workout audio configuration failed', error);
    });
  }, [analytics]);

  const initialize = useCallback(async () => {
    setInitializationError(null);
    try {
      const repositories = await appConfig.persistence.createRepositories();
      setContainer(createAppContainer(repositories));
      analytics.capture('app_initialized', { persistence: 'sqlite' });
      analytics.info('app initialized', { persistence: 'sqlite' });
    } catch (error) {
      analytics.error('app initialization failed', error, { persistence: 'sqlite' });
      setInitializationError(error instanceof Error ? error.message : 'Could not open the local database');
    }
  }, [analytics]);

  useEffect(() => { void initialize(); }, [initialize]);

  useEffect(() => {
    analytics.screen(route, { has_active_session: Boolean(activeSession) });
  }, [activeSession, analytics, route]);

  const loadVault = useCallback(() => container?.workouts.listVault() ?? Promise.resolve([]), [container]);
  const loadSaved = useCallback(() => container?.workouts.listSaved() ?? Promise.resolve([]), [container]);

  if (!container) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
        {initializationError ? (
          <>
            <Text style={styles.errorTitle}>Swing could not start.</Text>
            <Text style={styles.errorCopy}>{initializationError}</Text>
            <Text style={styles.retry} onPress={() => void initialize()}>Try again</Text>
          </>
        ) : (
          <><ActivityIndicator color={colors.primary} size="large" /><Text style={styles.loadingText}>Warming up…</Text></>
        )}
      </View>
    );
  }

  const openWorkout = (workout: WorkoutTemplate) => {
    analytics.capture('workout_selected', {
      workout_id: workout.id,
      source: workout.isVault ? 'vault' : 'library',
      equipment: workout.equipment,
      intensity: workout.intensity,
      rounds: workout.rounds,
      movements: workout.exercises.length
    });
    setSelectedWorkout(workout);
    setRoute('detail');
  };

  const startWorkout = async (workout: WorkoutTemplate) => {
    try {
      const session = await container.sessions.startWorkout(workout.id);
      analytics.capture('workout_started', {
        workout_id: workout.id,
        source: workout.isVault ? 'vault' : 'library',
        equipment: workout.equipment,
        intensity: workout.intensity,
        rounds: workout.rounds,
        movements: workout.exercises.length
      });
      analytics.info('workout started', {
        workout_id: workout.id,
        source: workout.isVault ? 'vault' : 'library',
        equipment: workout.equipment,
        intensity: workout.intensity
      });
      setActiveSession(session);
      setRoute('runner');
    } catch (error) {
      analytics.error('workout start failed', error, { workout_id: workout.id });
    }
  };

  const openTab = (tab: 'home' | 'vault' | 'saved' | 'history') => {
    analytics.capture('bottom_navigation_clicked', { destination: tab, source: route });
    setRoute(tab);
  };
  const activeTab = route === 'home' || route === 'vault' || route === 'saved' || route === 'history' ? route : null;

  let screen;
  if (route === 'home') {
    screen = <HomeScreen container={container} onCreate={() => { analytics.capture('home_action_clicked', { action: 'build_workout' }); setRoute('create'); }} onVault={() => { analytics.capture('home_action_clicked', { action: 'explore_vault' }); setRoute('vault'); }} onSaved={() => { analytics.capture('home_action_clicked', { action: 'open_library' }); setRoute('saved'); }} onResume={(session) => { analytics.capture('workout_resumed_from_home', { session_id: session.id, workout_id: session.workoutTemplateId }); setActiveSession(session); setRoute('runner'); }} />;
  } else if (route === 'vault') {
    screen = <WorkoutListScreen eyebrow="Ready when you are" title="The Vault" emptyMessage="Vault workouts could not be loaded." load={loadVault} onOpenWorkout={openWorkout} onStartWorkout={(workout) => void startWorkout(workout)} showFeatured onBack={() => setRoute('home')} />;
  } else if (route === 'saved') {
    screen = <WorkoutListScreen eyebrow="Built for you" title="My Workouts" description="Workouts you build, ready whenever you are." emptyTitle="Build your first workout" emptyMessage="Create a workout with your own movements and timing." load={loadSaved} onOpenWorkout={openWorkout} onDeleteWorkout={(workout) => container.workouts.deleteSavedWorkout(workout.id)} onBack={() => setRoute('home')} onCreate={() => setRoute('create')} />;
  } else if (route === 'history') {
    screen = <HistoryScreen container={container} onBack={() => setRoute('home')} />;
  } else if (route === 'create') {
    screen = <CreateWorkoutScreen container={container} onBack={() => setRoute('home')} onCreated={(workout) => { setSelectedWorkout(workout); setRoute('detail'); }} />;
  } else if (route === 'edit' && selectedWorkout) {
    screen = <CreateWorkoutScreen container={container} initialWorkout={selectedWorkout} onBack={() => setRoute('detail')} onCreated={(workout) => { setSelectedWorkout(workout); setRoute('detail'); }} />;
  } else if (route === 'detail' && selectedWorkout) {
    screen = <WorkoutDetailScreen workout={selectedWorkout} onBack={() => setRoute(selectedWorkout.isVault ? 'vault' : 'saved')} onStart={() => void startWorkout(selectedWorkout)} onEdit={() => setRoute('edit')} />;
  } else if (route === 'runner' && activeSession) {
    screen = <RunnerScreen container={container} initialSession={activeSession} onBell={playBell} onComplete={(session) => { const properties = { session_id: session.id, workout_id: session.workoutTemplateId, equipment: session.workoutSnapshot.equipment, intensity: session.workoutSnapshot.intensity, rounds: session.workoutSnapshot.rounds, movements: session.workoutSnapshot.exercises.length }; analytics.capture('workout_completed', properties); analytics.info('workout completed', properties); setActiveSession(session); setRoute('complete'); }} onEnd={() => { setActiveSession(null); setRoute('home'); }} />;
  } else if (route === 'complete' && activeSession) {
    screen = <CompletionScreen session={activeSession} onDone={() => { analytics.capture('completion_action_clicked', { action: 'done', session_id: activeSession.id }); setActiveSession(null); setRoute('home'); }} onRepeat={async () => {
      analytics.capture('completion_action_clicked', { action: 'repeat', session_id: activeSession.id });
      const workoutId = activeSession.workoutTemplateId;
      if (!workoutId) return;
      const workout = await container.workouts.getWorkout(workoutId);
      if (workout) await startWorkout(workout);
    }} />;
  } else {
    screen = <HomeScreen container={container} onCreate={() => setRoute('create')} onVault={() => setRoute('vault')} onSaved={() => setRoute('saved')} onResume={(session) => { setActiveSession(session); setRoute('runner'); }} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <View style={styles.screen}>{screen}</View>
      {activeTab ? <BottomNav active={activeTab} onSelect={openTab} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.xl },
  loadingText: { color: colors.textMuted, fontSize: 15, marginTop: spacing.md },
  errorTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  errorCopy: { color: colors.textMuted, fontSize: 15, textAlign: 'center', marginTop: spacing.sm },
  retry: { color: colors.primary, fontSize: 16, fontWeight: '800', marginTop: spacing.xl }
});
