import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { completionMessageForSession } from '../../domain/completionMessages';
import type { WorkoutSession } from '../../domain/session';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { AppScreen } from '../components/AppScreen';
import { ActionButton } from '../components/Buttons';
import { CompletionConfetti } from '../components/CompletionConfetti';
import { EditorialIcon } from '../components/EditorialIcon';

type Props = { session: WorkoutSession; onDone: () => void };

export function CompletionScreen({ session, onDone }: Props) {
  const message = useMemo(() => completionMessageForSession(session.id), [session.id]);

  return (
    <AppScreen scroll={false}>
      <View style={styles.content}>
        <CompletionConfetti />
        <View style={styles.check}><EditorialIcon accent="#FFE7A3" color={colors.onPrimary} name="check" size={40} /></View>
        <Text style={styles.title}>You earned{`\n`}this sweat.</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.action}>
          <ActionButton onPress={onDone}>Done</ActionButton>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { color: colors.text, fontSize: 40, lineHeight: 44, fontWeight: '900', letterSpacing: -1.5, textAlign: 'center' },
  message: { color: colors.work, fontSize: 17, fontWeight: '800', lineHeight: 23, marginTop: spacing.lg, maxWidth: 280, textAlign: 'center' },
  action: { width: '100%', marginTop: spacing.xxl }
});
