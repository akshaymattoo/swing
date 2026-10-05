import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { radii, spacing } from "../../theme/spacing";
import { EditorialIcon, type EditorialIconName } from "./EditorialIcon";

type Tab = "home" | "vault" | "saved" | "history";

type Props = {
  active: Tab;
  onSelect: (tab: Tab) => void;
};

const tabs: Array<{ id: Tab; label: string; icon: EditorialIconName }> = [
  { id: "home", label: "Home", icon: "home" },
  { id: "vault", label: "Vault", icon: "vault" },
  { id: "saved", label: "Library", icon: "workouts" },
  { id: "history", label: "History", icon: "progress" },
];

export function BottomNav({ active, onSelect }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const selected = tab.id === active;
          const selectedFilledIcon = selected && (tab.id === 'vault' || tab.id === 'saved');
          return (
            <Pressable
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              hitSlop={4}
              key={tab.id}
              onPress={() => onSelect(tab.id)}
              style={({ pressed }) => [
                styles.item,
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[styles.iconPlate, selected && styles.selectedIconPlate]}
              >
                <EditorialIcon
                  color={selectedFilledIcon ? colors.text : selected ? colors.onPrimary : colors.text}
                  accent={selected ? "#FFC83D" : colors.primary}
                  name={tab.icon}
                  size={23}
                />
              </View>
              <Text style={[styles.label, selected && styles.selectedText]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.surface },
  nav: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: "center",
    minHeight: 58,
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: radii.md,
  },
  selected: { backgroundColor: colors.surfaceRaised },
  pressed: { opacity: 0.68, transform: [{ scale: 0.97 }] },
  iconPlate: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 34,
    justifyContent: "center",
    width: 44,
  },
  selectedIconPlate: {
    backgroundColor: colors.work,
    borderColor: colors.text,
    borderWidth: 1.5,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  selectedText: { color: colors.work, fontWeight: "900" },
});
