import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Tab = 'home' | 'vault' | 'saved' | 'history';

type Props = {
  active: Tab;
  onSelect: (tab: Tab) => void;
};

const tabs: Array<{ id: Tab; icon: string; label: string }> = [
  { id: 'home', icon: '⌂', label: 'Home' },
  { id: 'vault', icon: '◆', label: 'Vault' },
  { id: 'saved', icon: '♥', label: 'Saved' },
  { id: 'history', icon: '↺', label: 'History' }
];

export function BottomNav({ active, onSelect }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <Pressable key={tab.id} onPress={() => onSelect(tab.id)} style={[styles.item, selected && styles.selected]}>
              <Text style={[styles.icon, selected && styles.selectedText]}>{tab.icon}</Text>
              <Text style={[styles.label, selected && styles.selectedText]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface },
  nav: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  item: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.md },
  selected: { backgroundColor: colors.surfaceRaised },
  icon: { color: colors.textMuted, fontSize: 19, fontWeight: '800' },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  selectedText: { color: colors.work }
});
