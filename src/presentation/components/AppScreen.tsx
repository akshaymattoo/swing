import type { PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  left?: ReactNode;
  right?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
}>;

export function AppScreen({ children, title, eyebrow, left, right, footer, scroll = true }: Props) {
  const content = (
    <View style={styles.content}>
      {(title || eyebrow || left || right) && (
        <View style={styles.header}>
          {left}
          <View style={styles.headerText}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          {right}
        </View>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.frame}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  frame: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { flex: 1, padding: spacing.xl, gap: spacing.lg },
  footer: { backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  headerText: { flex: 1 },
  eyebrow: { color: colors.work, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 34, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2, marginTop: spacing.xs }
});
