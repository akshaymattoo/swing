import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import type { WorkoutSession } from '../../domain/session';
import type { WorkoutTemplate } from '../../domain/workout';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { WorkoutCard } from '../components/WorkoutCard';

type Props = {
  container: AppContainer;
  onOpenWorkout: (workout: WorkoutTemplate) => void;
  onCreate: () => void;
  onVault: () => void;
  onSaved: () => void;
  onHistory: () => void;
  onResume: (session: WorkoutSession) => void;
};

export function HomeScreen(props: Props) {
  const [quickStart, setQuickStart] = useState<WorkoutTemplate | null>(null);
  const [active, setActive] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    Promise.all([props.container.workouts.listVault(), props.container.sessions.getActiveSession()]).then(([vault, session]) => {
      setQuickStart(vault.find((workout) => workout.id === 'vault-kettlebell-1') ?? vault[0] ?? null);
      setActive(session);
    });
  }, [props.container]);

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
          <Text style={styles.sectionLabel}>QUICK START</Text>
          <WorkoutCard workout={quickStart} featured onPress={() => props.onOpenWorkout(quickStart)} />
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.actionTile} onPress={props.onCreate}>
          <Text style={styles.actionIcon}>＋</Text>
          <Text style={styles.actionTitle}>Create workout</Text>
          <Text style={styles.actionCopy}>Make your own in under a minute.</Text>
        </Pressable>
        <Pressable style={styles.actionTile} onPress={props.onVault}>
          <Text style={styles.actionIcon}>◆</Text>
          <Text style={styles.actionTitle}>Open The Vault</Text>
          <Text style={styles.actionCopy}>Twelve workouts, ready to go.</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryActions}>
        <ActionButton variant="secondary" onPress={props.onSaved} style={styles.secondaryButton}>Saved</ActionButton>
        <ActionButton variant="secondary" onPress={props.onHistory} style={styles.secondaryButton}>History</ActionButton>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  sectionLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  resume: { backgroundColor: colors.surfaceRaised, borderRadius: radii.md, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resumeKicker: { color: colors.work, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  resumeTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.xs },
  resumeAction: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: spacing.md },
  actionTile: { flex: 1, minHeight: 150, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  actionIcon: { color: colors.primary, fontSize: 28, fontWeight: '700' },
  actionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.md },
  actionCopy: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: spacing.xs },
  secondaryActions: { flexDirection: 'row', gap: spacing.md },
  secondaryButton: { flex: 1 }
});
