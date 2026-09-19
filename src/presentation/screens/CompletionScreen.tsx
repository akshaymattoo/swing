import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutSession } from '../../domain/session';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';

type Props = { session: WorkoutSession; onDone: () => void; onRepeat: () => void };

export function CompletionScreen({ session, onDone, onRepeat }: Props) {
  return (
    <AppScreen scroll={false}>
      <View style={styles.content}>
        <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
        <Text style={styles.eyebrow}>WORKOUT COMPLETE</Text>
        <Text style={styles.title}>You gave it{`\n`}a swing.</Text>
        <Text style={styles.summary}>{session.workoutSnapshot.emoji} {session.workoutSnapshot.name} · {session.workoutSnapshot.rounds} rounds</Text>
        <View style={styles.saved}><Text style={styles.savedKicker}>SAVED AUTOMATICALLY</Text><Text style={styles.savedTitle}>Added to History</Text></View>
        <View style={styles.actions}>
          <ActionButton onPress={onDone}>Done</ActionButton>
          <ActionButton variant="secondary" onPress={onRepeat}>Do it again</ActionButton>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  check: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  checkText: { color: colors.onPrimary, fontSize: 50, fontWeight: '900' },
  eyebrow: { color: colors.work, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 42, lineHeight: 46, fontWeight: '900', letterSpacing: -1.5, textAlign: 'center', marginTop: spacing.sm },
  summary: { color: colors.textMuted, fontSize: 15, marginTop: spacing.md },
  saved: { width: '100%', backgroundColor: colors.surfaceRaised, borderRadius: radii.lg, padding: spacing.xl, alignItems: 'center', marginTop: spacing.xxl },
  savedKicker: { color: colors.work, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  savedTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: spacing.xs },
  actions: { width: '100%', gap: spacing.md, marginTop: spacing.xl }
});
