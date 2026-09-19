import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AppContainer } from '../../application/appContainer';
import type { WorkoutSession } from '../../domain/session';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { formatSessionDate } from '../formatters';

type Props = { container: AppContainer; onBack: () => void };

export function HistoryScreen({ container, onBack }: Props) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    container.sessions.listHistory().then(setSessions);
  }, [container]);

  return (
    <AppScreen eyebrow="Your effort" title="History" right={<ActionButton variant="ghost" onPress={onBack}>Back</ActionButton>}>
      {sessions.length ? sessions.map((session) => (
        <View key={session.id} style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.title}>{session.workoutSnapshot.emoji} {session.workoutSnapshot.name}</Text>
            <Text style={styles.date}>{formatSessionDate(session.startedAt)}</Text>
          </View>
          <Text style={[styles.status, session.status === 'completed' ? styles.complete : styles.abandoned]}>
            {session.status === 'completed' ? 'Done' : session.status === 'active' ? 'Active' : 'Ended'}
          </Text>
        </View>
      )) : (
        <View style={styles.empty}><Text style={styles.emptyTitle}>Your first swing is waiting.</Text><Text style={styles.date}>Completed workouts will appear here.</Text></View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  copy: { flex: 1 },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  date: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  status: { fontSize: 12, fontWeight: '800', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill },
  complete: { color: colors.success, backgroundColor: colors.successSurface },
  abandoned: { color: colors.danger, backgroundColor: colors.dangerSurface },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { color: colors.text, fontSize: 22, fontWeight: '900' }
});
