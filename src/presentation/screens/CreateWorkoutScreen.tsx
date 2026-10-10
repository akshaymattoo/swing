import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { AppContainer } from "../../application/appContainer";
import { useAnalytics } from "../../analytics/useAnalytics";
import {
  DEFAULT_STARTUP_SECONDS,
  mvpEquipmentOptions,
  intensityOptions,
  type Equipment,
  type Intensity,
  type WorkoutTemplate,
} from "../../domain/workout";
import { colors } from "../../theme/colors";
import { radii, spacing } from "../../theme/spacing";
import { AppScreen } from "../components/AppScreen";
import { ActionButton, BackButton } from "../components/Buttons";
import { EditorialIcon } from "../components/EditorialIcon";
import { formatDuration } from "../formatters";

type Props = {
  container: AppContainer;
  onBack: () => void;
  onCreated: (workout: WorkoutTemplate) => void;
  initialWorkout?: WorkoutTemplate;
};

const workOptions = [5, 10, 20, 30, 45, 60];
const restOptions = [0, 10, 20, 30, 45, 60];

export function CreateWorkoutScreen({ container, onBack, onCreated, initialWorkout }: Props) {
  const analytics = useAnalytics();
  const isEditing = Boolean(initialWorkout);
  const isEditingCopy = Boolean(initialWorkout?.isVault);
  const [name, setName] = useState(initialWorkout?.name ?? "");
  const [emoji, setEmoji] = useState(initialWorkout?.emoji ?? "🔥");
  const [equipment, setEquipment] = useState<Equipment>(initialWorkout?.equipment ?? "bodyweight");
  const [intensity, setIntensity] = useState<Intensity>(initialWorkout?.intensity ?? "spicy");
  const [rounds, setRounds] = useState(initialWorkout?.rounds ?? 4);
  const startupSeconds = DEFAULT_STARTUP_SECONDS;
  const [workSeconds, setWorkSeconds] = useState(initialWorkout?.workSeconds ?? 45);
  const [restSeconds, setRestSeconds] = useState(initialWorkout?.restSeconds ?? 20);
  const [movements, setMovements] = useState(initialWorkout?.exercises.map((exercise) => exercise.name) ?? ["", "", ""]);
  const [saving, setSaving] = useState(false);

  const filledMovements = movements.filter((movement) => movement.trim());
  const estimatedSeconds = useMemo(
    () =>
      container.workouts.calculateDuration({
        rounds,
        startupSeconds,
        workSeconds,
        restSeconds,
        exercises: filledMovements,
      }),
    [
      container,
      filledMovements.join("|"),
      restSeconds,
      rounds,
      startupSeconds,
      workSeconds,
    ],
  );

  const updateMovement = (index: number, value: string) => {
    setMovements((current) =>
      current.map((movement, position) =>
        position === index ? value : movement,
      ),
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const draft = {
        name,
        emoji,
        equipment,
        intensity,
        rounds,
        startupSeconds,
        workSeconds,
        restSeconds,
        exercises: filledMovements,
        sourceTemplateId: isEditingCopy ? initialWorkout?.id : initialWorkout?.sourceTemplateId,
      };
      const workout = initialWorkout && !initialWorkout.isVault
        ? await container.workouts.updateWorkout(initialWorkout.id, draft)
        : await container.workouts.createWorkout(draft);
      analytics.capture(initialWorkout && !initialWorkout.isVault ? "custom_workout_updated" : "custom_workout_created", {
        workout_id: workout.id,
        source: isEditingCopy ? "vault_copy" : isEditing ? "library" : "new",
        equipment: workout.equipment,
        intensity: workout.intensity,
        rounds: workout.rounds,
        movements: workout.exercises.length,
        startup_seconds: workout.startupSeconds,
        work_seconds: workout.workSeconds,
        rest_seconds: workout.restSeconds,
      });
      onCreated(workout);
    } catch (error) {
      analytics.error("custom workout save failed", error, {
        mode: isEditingCopy ? "vault_copy" : isEditing ? "edit" : "create",
        equipment,
        intensity,
        rounds,
        movements: filledMovements.length,
      });
      Alert.alert(
        "Almost there",
        error instanceof Error ? error.message : "Unable to save workout",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppScreen
        title={isEditing && !isEditingCopy ? "Edit" : "Build"}
        left={<BackButton onPress={onBack} />}
      >
        <View style={styles.nameRow}>
          <TextInput
            value={emoji}
            onChangeText={setEmoji}
            selectTextOnFocus
            style={[styles.input, styles.emojiInput]}
            accessibilityLabel="Workout emoji"
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Friday Fire"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.nameInput]}
            accessibilityLabel="Workout name"
          />
        </View>

        <FieldLabel>Equipment</FieldLabel>
        <ChoiceRow
          values={mvpEquipmentOptions}
          selected={equipment}
          onSelect={(value) => setEquipment(value as Equipment)}
        />

        <FieldLabel>Intensity</FieldLabel>
        <ChoiceRow
          values={intensityOptions}
          selected={intensity}
          onSelect={(value) => setIntensity(value as Intensity)}
          labels={{ mild: "🌶️", spicy: "🌶️🌶️", hot: "🌶️🌶️🌶️" }}
        />

        <FieldLabel>Rounds</FieldLabel>
        <View style={styles.stepper}>
          <Pressable
            accessibilityLabel="Decrease rounds"
            style={styles.stepperButton}
            onPress={() => setRounds((value) => Math.max(1, value - 1))}
          >
            <EditorialIcon name="minus" size={28} />
          </Pressable>
          <View style={styles.stepperValue}>
            <Text style={styles.stepperNumber}>{rounds}</Text>
            <Text style={styles.stepperCaption}>rounds</Text>
          </View>
          <Pressable
            accessibilityLabel="Increase rounds"
            style={styles.stepperButton}
            onPress={() => setRounds((value) => Math.min(20, value + 1))}
          >
            <EditorialIcon name="plus" size={28} />
          </Pressable>
        </View>

        <FieldLabel>Work per movement</FieldLabel>
        <ChoiceRow
          values={workOptions}
          selected={workSeconds}
          onSelect={(value) => setWorkSeconds(Number(value))}
          suffix="s"
        />

        <FieldLabel>Rest between movements</FieldLabel>
        <ChoiceRow
          values={restOptions}
          selected={restSeconds}
          onSelect={(value) => setRestSeconds(Number(value))}
          suffix="s"
        />

        <View style={styles.movementHeader}>
          <FieldLabel>{`Movements (${filledMovements.length})`}</FieldLabel>
          <Pressable
            accessibilityLabel="Add movement"
            onPress={() => setMovements((current) => [...current, ""])}
            style={styles.addMovementButton}
          >
            <EditorialIcon name="plus" size={20} />
            <Text style={styles.addMovement}>Add</Text>
          </Pressable>
        </View>
        {movements.map((movement, index) => (
          <View key={index} style={styles.movementRow}>
            <Text style={styles.movementNumber}>{index + 1}</Text>
            <TextInput
              value={movement}
              onChangeText={(value) => updateMovement(index, value)}
              placeholder={
                index === 0 ? "e.g. Kettlebell swings" : "Movement name"
              }
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.movementInput]}
              accessibilityLabel={`Movement ${index + 1}`}
            />
            {movements.length > 1 ? (
              <Pressable
                accessibilityLabel={`Remove movement ${index + 1}`}
                onPress={() =>
                  setMovements((current) =>
                    current.filter((_, position) => position !== index),
                  )
                }
                style={styles.removeButton}
              >
                <EditorialIcon color={colors.danger} name="delete" size={20} />
              </Pressable>
            ) : null}
          </View>
        ))}

        {filledMovements.length ? (
          <View style={styles.estimate}>
            <Text style={styles.estimateLabel}>ESTIMATED TIME</Text>
            <Text style={styles.estimateValue}>{formatDuration(estimatedSeconds)}</Text>
          </View>
        ) : null}
        <ActionButton disabled={saving} onPress={save}>
          {saving ? "Saving…" : isEditingCopy ? "Save as new workout" : isEditing ? "Save changes" : "Save workout"}
        </ActionButton>
      </AppScreen>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function ChoiceRow({
  values,
  selected,
  onSelect,
  labels,
  suffix = "",
}: {
  values: readonly (string | number)[];
  selected: string | number;
  onSelect: (value: string | number) => void;
  labels?: Record<string, string>;
  suffix?: string;
}) {
  return (
    <View style={styles.choices}>
      {values.map((value) => {
        const isSelected = value === selected;
        return (
          <Pressable
            key={value}
            onPress={() => onSelect(value)}
            style={[styles.choice, isSelected && styles.choiceSelected]}
          >
            <Text
              style={[
                styles.choiceText,
                isSelected && styles.choiceTextSelected,
              ]}
            >
              {labels?.[String(value)] ?? `${value}${suffix}`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: -spacing.sm,
  },
  input: {
    minHeight: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
  },
  nameRow: { flexDirection: "row", gap: spacing.sm },
  emojiInput: {
    width: 64,
    textAlign: "center",
    fontSize: 22,
    paddingHorizontal: spacing.sm,
  },
  nameInput: { flex: 1 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  choice: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  choiceSelected: { backgroundColor: colors.work, borderColor: colors.work },
  choiceText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  choiceTextSelected: { color: colors.onPrimary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  stepperButton: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  stepperValue: { width: 82, alignItems: "center" },
  stepperNumber: { color: colors.text, fontSize: 21, fontWeight: "900" },
  stepperCaption: { color: colors.textMuted, fontSize: 11 },
  movementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addMovementButton: { alignItems: "center", flexDirection: "row", gap: 5 },
  addMovement: { color: colors.text, fontSize: 14, fontWeight: "900" },
  movementRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  movementNumber: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    width: 20,
  },
  movementInput: { flex: 1 },
  removeButton: { alignItems: "center", height: 36, justifyContent: "center", width: 32 },
  estimate: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  estimateLabel: {
    color: colors.work,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  estimateValue: { color: colors.text, fontSize: 18, fontWeight: "900" },
});
