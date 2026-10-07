export const equipmentOptions = ['bodyweight', 'kettlebell', 'dumbbells', 'bands'] as const;
export type Equipment = (typeof equipmentOptions)[number];

// Keep the broader type for existing local data and an easy future re-launch,
// while the current MVP presents only the two lowest-barrier options.
export const mvpEquipmentOptions = ['bodyweight', 'kettlebell'] as const satisfies readonly Equipment[];
export type MvpEquipment = (typeof mvpEquipmentOptions)[number];

export function isMvpEquipment(equipment: Equipment): equipment is MvpEquipment {
  return mvpEquipmentOptions.some((option) => option === equipment);
}

export const intensityOptions = ['mild', 'spicy', 'hot'] as const;
export type Intensity = (typeof intensityOptions)[number];
export const DEFAULT_STARTUP_SECONDS = 20;

export type WorkoutExercise = {
  id: string;
  name: string;
  position: number;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  emoji: string | null;
  equipment: Equipment;
  intensity: Intensity;
  rounds: number;
  startupSeconds: number;
  workSeconds: number;
  restSeconds: number;
  exercises: WorkoutExercise[];
  isVault: boolean;
  isSaved: boolean;
  sourceTemplateId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutDraft = Pick<
  WorkoutTemplate,
  'name' | 'emoji' | 'equipment' | 'intensity' | 'rounds' | 'startupSeconds' | 'workSeconds' | 'restSeconds'
> & {
  exercises: string[];
  sourceTemplateId?: string | null;
};

export function workoutDurationSeconds(workout: Pick<WorkoutTemplate, 'rounds' | 'startupSeconds' | 'workSeconds' | 'restSeconds' | 'exercises'>) {
  const intervals = workout.rounds * workout.exercises.length;
  if (intervals === 0) return 0;
  return workout.startupSeconds + intervals * workout.workSeconds + Math.max(0, intervals - 1) * workout.restSeconds;
}

export function intensityLabel(intensity: Intensity) {
  if (intensity === 'mild') return '🌶️';
  if (intensity === 'spicy') return '🌶️🌶️';
  return '🌶️🌶️🌶️';
}

export function equipmentLabel(equipment: Equipment) {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}

export function equipmentEmoji(equipment: Equipment) {
  if (equipment === 'bodyweight') return '🤸';
  if (equipment === 'kettlebell') return '🔔';
  if (equipment === 'dumbbells') return '🏋️';
  return '〰️';
}
