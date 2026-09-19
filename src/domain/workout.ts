export const equipmentOptions = ['bodyweight', 'kettlebell', 'dumbbells', 'bands'] as const;
export type Equipment = (typeof equipmentOptions)[number];

export const intensityOptions = ['mild', 'spicy', 'hot'] as const;
export type Intensity = (typeof intensityOptions)[number];

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
  'name' | 'emoji' | 'equipment' | 'intensity' | 'rounds' | 'workSeconds' | 'restSeconds'
> & {
  exercises: string[];
  sourceTemplateId?: string | null;
};

export function workoutDurationSeconds(workout: Pick<WorkoutTemplate, 'rounds' | 'workSeconds' | 'restSeconds' | 'exercises'>) {
  const intervals = workout.rounds * workout.exercises.length;
  if (intervals === 0) return 0;
  return intervals * workout.workSeconds + Math.max(0, intervals - 1) * workout.restSeconds;
}

export function intensityLabel(intensity: Intensity) {
  if (intensity === 'mild') return '🌶️ Mild';
  if (intensity === 'spicy') return '🌶️🌶️ Spicy';
  return '🌶️🌶️🌶️ Hot';
}

export function equipmentLabel(equipment: Equipment) {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}
