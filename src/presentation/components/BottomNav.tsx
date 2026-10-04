import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Tab = 'home' | 'vault' | 'saved' | 'history';

type Props = {
  active: Tab;
  onSelect: (tab: Tab) => void;
};

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'vault', label: 'Vault' },
  { id: 'saved', label: 'Saved' },
  { id: 'history', label: 'History' }
];

export function BottomNav({ active, onSelect }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <Pressable
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              hitSlop={4}
              key={tab.id}
              onPress={() => onSelect(tab.id)}
              style={({ pressed }) => [styles.item, selected && styles.selected, pressed && styles.pressed]}
            >
              <View style={[styles.iconPlate, selected && styles.selectedIconPlate]}>
                <NavIcon color={selected ? colors.onPrimary : colors.textMuted} name={tab.id} />
              </View>
              <Text style={[styles.label, selected && styles.selectedText]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function NavIcon({ color, name }: { color: string; name: Tab }) {
  if (name === 'home') {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.homeRoof, { borderColor: color }]} />
        <View style={[styles.homeBody, { borderColor: color }]}>
          <View style={[styles.homeDoor, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === 'vault') {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.vaultDiamond, { borderColor: color }]}>
          <View style={[styles.vaultCenter, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === 'saved') {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.heartBase, { backgroundColor: color }]} />
        <View style={[styles.heartLobeLeft, { backgroundColor: color }]} />
        <View style={[styles.heartLobeRight, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.iconCanvas}>
      <View style={[styles.historyRing, { borderColor: color }]} />
      <View style={[styles.historyArrow, { borderBottomColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface },
  nav: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  item: { flex: 1, alignItems: 'center', minHeight: 58, justifyContent: 'center', paddingVertical: 5, borderRadius: radii.md },
  selected: { backgroundColor: colors.surfaceRaised },
  pressed: { opacity: 0.68, transform: [{ scale: 0.97 }] },
  iconPlate: { alignItems: 'center', borderRadius: radii.pill, height: 30, justifyContent: 'center', width: 38 },
  selectedIconPlate: { backgroundColor: colors.work },
  iconCanvas: { height: 22, position: 'relative', width: 22 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700', marginTop: 3 },
  selectedText: { color: colors.work, fontWeight: '900' },
  homeRoof: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 14,
    left: 4,
    position: 'absolute',
    top: 1,
    transform: [{ rotate: '45deg' }],
    width: 14
  },
  homeBody: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    bottom: 1,
    height: 11,
    left: 4,
    position: 'absolute',
    width: 14
  },
  homeDoor: { bottom: 0, height: 6, left: 5, position: 'absolute', width: 3 },
  vaultDiamond: {
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 2,
    height: 15,
    justifyContent: 'center',
    left: 3.5,
    position: 'absolute',
    top: 3.5,
    transform: [{ rotate: '45deg' }],
    width: 15
  },
  vaultCenter: { borderRadius: 2, height: 4, width: 4 },
  heartBase: { height: 12, left: 5, position: 'absolute', top: 6, transform: [{ rotate: '45deg' }], width: 12 },
  heartLobeLeft: { borderRadius: 6, height: 12, left: 3, position: 'absolute', top: 2, width: 12 },
  heartLobeRight: { borderRadius: 6, height: 12, left: 8, position: 'absolute', top: 2, width: 12 },
  historyRing: { borderRadius: 9, borderWidth: 2, height: 18, left: 2, position: 'absolute', top: 2, width: 18 },
  historyArrow: {
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderLeftWidth: 4,
    borderRightColor: 'transparent',
    borderRightWidth: 4,
    height: 0,
    left: 1,
    position: 'absolute',
    top: 2,
    transform: [{ rotate: '-28deg' }],
    width: 0
  }
});
