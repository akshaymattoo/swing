import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';

import { createAppContainer, type AppContainer } from './src/application/appContainer';
import { appConfig } from './src/config/appConfig';
import type { WorkoutSession } from './src/domain/session';
import type { WorkoutTemplate } from './src/domain/workout';
import { colors } from './src/theme/colors';
import { spacing } from './src/theme/spacing';
import { bellSoundUri } from './src/presentation/audio/bell';
import { BottomNav } from './src/presentation/components/BottomNav';
import { CompletionScreen } from './src/presentation/screens/CompletionScreen';
import { CreateWorkoutScreen } from './src/presentation/screens/CreateWorkoutScreen';
import { HistoryScreen } from './src/presentation/screens/HistoryScreen';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { RunnerScreen } from './src/presentation/screens/RunnerScreen';
import { WorkoutDetailScreen } from './src/presentation/screens/WorkoutDetailScreen';
import { WorkoutListScreen } from './src/presentation/screens/WorkoutListScreen';

type Route = 'home' | 'vault' | 'saved' | 'create' | 'detail' | 'runner' | 'complete' | 'history';

export default function App() {
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [route, setRoute] = useState<Route>('home');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const bellPlayer = useAudioPlayer(bellSoundUri);

  const playBell = useCallback(() => {
    void bellPlayer.seekTo(0).then(() => bellPlayer.play()).catch(() => undefined);
  }, [bellPlayer]);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const initialize = useCallback(async () => {
    setInitializationError(null);
    try {
      const repositories = await appConfig.persistence.createRepositories();
      setContainer(createAppContainer(repositories));
    } catch (error) {
      setInitializationError(error instanceof Error ? error.message : 'Could not open the local database');
    }
  }, []);

  useEffect(() => { void initialize(); }, [initialize]);

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
    setSelectedWorkout(workout);
    setRoute('detail');
  };

  const startWorkout = async (workout: WorkoutTemplate) => {
    const session = await container.sessions.startWorkout(workout.id);
    setActiveSession(session);
    setRoute('runner');
  };

  const openTab = (tab: 'home' | 'vault' | 'saved' | 'history') => setRoute(tab);
  const activeTab = route === 'home' || route === 'vault' || route === 'saved' || route === 'history' ? route : null;

  let screen;
  if (route === 'home') {
    screen = <HomeScreen container={container} onStartWorkout={(workout) => void startWorkout(workout)} onCreate={() => setRoute('create')} onVault={() => setRoute('vault')} onSaved={() => setRoute('saved')} onHistory={() => setRoute('history')} onResume={(session) => { setActiveSession(session); setRoute('runner'); }} />;
  } else if (route === 'vault') {
    screen = <WorkoutListScreen eyebrow="Ready when you are" title="The Vault" emptyMessage="Vault workouts could not be loaded." load={loadVault} onOpenWorkout={openWorkout} onStartWorkout={(workout) => void startWorkout(workout)} showFeatured onBack={() => setRoute('home')} />;
  } else if (route === 'saved') {
    screen = <WorkoutListScreen eyebrow="Your collection" title="Saved workouts" emptyMessage="Create a workout or save one from The Vault." load={loadSaved} onOpenWorkout={openWorkout} onBack={() => setRoute('home')} onCreate={() => setRoute('create')} />;
  } else if (route === 'history') {
    screen = <HistoryScreen container={container} onBack={() => setRoute('home')} />;
  } else if (route === 'create') {
    screen = <CreateWorkoutScreen container={container} onBack={() => setRoute('home')} onCreated={(workout) => { setSelectedWorkout(workout); setRoute('detail'); }} />;
  } else if (route === 'detail' && selectedWorkout) {
    screen = <WorkoutDetailScreen workout={selectedWorkout} onBack={() => setRoute(selectedWorkout.isVault ? 'vault' : 'saved')} onStart={() => void startWorkout(selectedWorkout)} onSave={async () => {
      const saved = await container.workouts.copyToSaved(selectedWorkout.id);
      setSelectedWorkout(saved);
      Alert.alert('Saved', `${saved.name} is now in your workouts.`);
    }} />;
  } else if (route === 'runner' && activeSession) {
    screen = <RunnerScreen container={container} initialSession={activeSession} onBell={playBell} onComplete={(session) => { setActiveSession(session); setRoute('complete'); }} onEnd={() => { setActiveSession(null); setRoute('home'); }} />;
  } else if (route === 'complete' && activeSession) {
    screen = <CompletionScreen session={activeSession} onDone={() => { setActiveSession(null); setRoute('home'); }} onRepeat={async () => {
      const workoutId = activeSession.workoutTemplateId;
      if (!workoutId) return;
      const workout = await container.workouts.getWorkout(workoutId);
      if (workout) await startWorkout(workout);
    }} />;
  } else {
    screen = <HomeScreen container={container} onStartWorkout={(workout) => void startWorkout(workout)} onCreate={() => setRoute('create')} onVault={() => setRoute('vault')} onSaved={() => setRoute('saved')} onHistory={() => setRoute('history')} onResume={(session) => { setActiveSession(session); setRoute('runner'); }} />;
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
