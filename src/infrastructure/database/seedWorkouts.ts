import type { Equipment, Intensity, WorkoutTemplate } from '../../domain/workout';
import { DEFAULT_STARTUP_SECONDS } from '../../domain/workout';
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
  { id: 'vault-bodyweight-1', name: 'Spidey Bite 20', emoji: '🕷️', equipment: 'bodyweight', intensity: 'spicy', rounds: 8, workSeconds: 40, restSeconds: 10, exercises: ['Pull-ups', 'Push-ups', 'Air squats'] },
  { id: 'vault-bodyweight-2', name: 'Mogambo Muscle Torture', emoji: '😈', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 15, exercises: ['Burpees', 'Mountain climbers', 'Reverse lunges'] },
  { id: 'vault-bodyweight-3', name: 'Krrish Ka Kalesh', emoji: '🌪️', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 20, exercises: ['Squat jumps', 'Push-ups', 'High knees', 'Plank jacks'] },
  { id: 'vault-kettlebell-1', name: 'Baahubali Bell Brawl', emoji: '⚔️', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell swings', 'Goblet squats', 'Push-ups'] },
  { id: 'vault-kettlebell-2', name: "Don's Deadlift Deal", emoji: '🕶️', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Suitcase march'] },
  { id: 'vault-kettlebell-3', name: "Gabbar's Swing Tax", emoji: '🤠', equipment: 'kettlebell', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Kettlebell swings', 'Clean and press', 'Front rack lunges'] },
  { id: 'vault-dumbbells-1', name: 'Dhoom Dumbbell Dhamaka', emoji: '🏍️', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Thrusters', 'Bent-over rows', 'Romanian deadlifts'] },
  { id: 'vault-dumbbells-2', name: 'Munna Bhai Muscle Break', emoji: '😎', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 30, restSeconds: 15, exercises: ['Goblet squats', 'Floor press', 'Alternating rows'] },
  { id: 'vault-dumbbells-3', name: 'Hulk Smash & Dash', emoji: '💚', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Devil press', 'Reverse lunges', 'Renegade rows', 'Thrusters'] },
  { id: 'vault-bands-1', name: "Jadoo's Band Baaja", emoji: '👽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Standing rows', 'Lateral walks'] },
  { id: 'vault-bands-2', name: "Vader's Resistance", emoji: '🛸', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded good mornings', 'Overhead press', 'Pallof press'] },
  { id: 'vault-bands-3', name: 'Wonder Woman Snapback', emoji: '⚡', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Skater steps', 'Plank pull-throughs'] }
];

export async function seedVault(workouts: WorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-09-20T00:00:00.000Z';
  for (const seed of seeds) {
    const existing = await workouts.getById(seed.id);
    if (existing?.updatedAt === contentVersion) continue;
    const workout: WorkoutTemplate = {
      ...seed,
      startupSeconds: DEFAULT_STARTUP_SECONDS,
      exercises: seed.exercises.map((name, position) => ({
        id: `${seed.id}-exercise-${position + 1}`,
        name,
        position
      })),
      isVault: true,
      isSaved: existing?.isSaved ?? false,
      sourceTemplateId: null,
      createdAt: existing?.createdAt ?? createdAt,
      updatedAt: contentVersion
    };
    await workouts.save(workout);
  }
}
