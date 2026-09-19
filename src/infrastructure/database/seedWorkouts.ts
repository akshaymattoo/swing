import type { Equipment, Intensity, WorkoutTemplate } from '../../domain/workout';
import type { WorkoutRepository } from '../../application/ports';

type Seed = {
  id: string;
  name: string;
  emoji: string;
  equipment: Equipment;
  intensity: Intensity;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  exercises: string[];
};

const seeds: Seed[] = [
  { id: 'vault-bodyweight-1', name: 'Quickfire Circuit', emoji: '⚡', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 30, restSeconds: 15, exercises: ['Air squats', 'Incline push-ups', 'Dead bugs'] },
  { id: 'vault-bodyweight-2', name: 'Burpee Bhoot', emoji: '👻', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 15, exercises: ['Burpees', 'Mountain climbers', 'Reverse lunges'] },
  { id: 'vault-bodyweight-3', name: 'Floor Is Lava', emoji: '🌋', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 20, exercises: ['Squat jumps', 'Push-ups', 'High knees', 'Plank jacks'] },
  { id: 'vault-kettlebell-1', name: 'Bellraiser', emoji: '🔔', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell swings', 'Goblet squats', 'Push-ups'] },
  { id: 'vault-kettlebell-2', name: 'Handle With Care', emoji: '🏋️', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Suitcase march'] },
  { id: 'vault-kettlebell-3', name: 'Swing & Regret', emoji: '💀', equipment: 'kettlebell', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Kettlebell swings', 'Clean and press', 'Front rack lunges'] },
  { id: 'vault-dumbbells-1', name: 'Double Trouble', emoji: '🔥', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Thrusters', 'Bent-over rows', 'Romanian deadlifts'] },
  { id: 'vault-dumbbells-2', name: 'Lunch Break Lift', emoji: '🥪', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 30, restSeconds: 15, exercises: ['Goblet squats', 'Floor press', 'Alternating rows'] },
  { id: 'vault-dumbbells-3', name: 'Full Send', emoji: '🚀', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Devil press', 'Reverse lunges', 'Renegade rows', 'Thrusters'] },
  { id: 'vault-bands-1', name: 'Band Together', emoji: '🤝', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Standing rows', 'Lateral walks'] },
  { id: 'vault-bands-2', name: 'Resistance Is Futile', emoji: '🛸', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded good mornings', 'Overhead press', 'Pallof press'] },
  { id: 'vault-bands-3', name: 'Snap Back', emoji: '⚡', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Skater steps', 'Plank pull-throughs'] }
];

export async function seedVault(workouts: WorkoutRepository) {
  if ((await workouts.listVault()).length > 0) return;
  const timestamp = new Date(0).toISOString();
  for (const seed of seeds) {
    const workout: WorkoutTemplate = {
      ...seed,
      exercises: seed.exercises.map((name, position) => ({
        id: `${seed.id}-exercise-${position + 1}`,
        name,
        position
      })),
      isVault: true,
      isSaved: false,
      sourceTemplateId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await workouts.save(workout);
  }
}
