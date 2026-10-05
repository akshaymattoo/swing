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
  sourceTitle?: string;
  sourceUrl?: string;
};

const seeds: Seed[] = [
  { id: 'vault-bodyweight-1', name: 'Spidey Bite 20', emoji: '🕷️', equipment: 'bodyweight', intensity: 'spicy', rounds: 8, workSeconds: 40, restSeconds: 10, exercises: ['Pull-ups', 'Push-ups', 'Air squats'] },
  { id: 'vault-bodyweight-2', name: 'Mogambo Muscle Torture', emoji: '😈', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 15, exercises: ['Burpees', 'Mountain climbers', 'Reverse lunges'] },
  { id: 'vault-bodyweight-3', name: 'Krrish Ka Kalesh', emoji: '🌪️', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 20, exercises: ['Squat jumps', 'Push-ups', 'High knees', 'Plank jacks'] },
  {
    id: 'vault-kettlebell-1', name: "Rocky's Bell Ringer", emoji: '🥊', equipment: 'kettlebell', intensity: 'mild', rounds: 4, workSeconds: 40, restSeconds: 20,
    exercises: ['Kettlebell swings', 'Single-arm presses', 'Front-rack squats'],
    sourceTitle: 'The BEST Kettlebell Workout For Anyone (Beginner/Advanced)', sourceUrl: 'https://www.youtube.com/watch?v=zGxnnKrvDvY'
  },
  {
    id: 'vault-kettlebell-2', name: "Pathaan's Five-Fold Fury", emoji: '🔥', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20,
    exercises: ['Single-arm swings', 'Front-rack squats', 'High pulls', 'Single-arm presses', 'Push-ups'],
    sourceTitle: 'Establishing Consistency', sourceUrl: 'https://www.youtube.com/watch?v=cVmcf7jZq3U'
  },
  {
    id: 'vault-kettlebell-3', name: "John Wick's Casket Circuit", emoji: '🪦', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 45, restSeconds: 15,
    exercises: ['Bent-over rows', 'Push press', 'Goblet squats', 'Push-ups'],
    sourceTitle: 'FULL UNEDITED - The CASKET Double Kettlebell Ladder Workout For Time', sourceUrl: 'https://www.youtube.com/watch?v=JayvrrXJPlQ'
  },
  {
    id: 'vault-kettlebell-4', name: 'Shaktimaan Switch-Hit', emoji: '⚡', equipment: 'kettlebell', intensity: 'spicy', rounds: 5, workSeconds: 45, restSeconds: 15,
    exercises: ['Clean, squat and reverse lunge', 'Row, waiter clean and press'],
    sourceTitle: '15 Minute Follow Along Kettlebell Workout: Full Body Strength and Conditioning', sourceUrl: 'https://www.youtube.com/watch?v=jeRYegot0iU'
  },
  {
    id: 'vault-kettlebell-5', name: 'Avengers Bell Assemble', emoji: '🛡️', equipment: 'kettlebell', intensity: 'spicy', rounds: 5, workSeconds: 40, restSeconds: 20,
    exercises: ['Kettlebell swings', 'Single-arm rows', 'Cleans', 'Goblet squats', 'Snatches'],
    sourceTitle: "C.A.R.s, Get Up's, & FUNctional Fitness w/Peter Nieman | Sessions Vol. 4", sourceUrl: 'https://www.youtube.com/watch?v=6nakYJVxk-8'
  },
  {
    id: 'vault-kettlebell-6', name: "Deadpool's Bell Buffet", emoji: '🌮', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 45, restSeconds: 15,
    exercises: ['Snatch to squat', 'Swing to push-up', 'High pulls', 'Clean to reverse lunge'],
    sourceTitle: 'Can you really get shredded in 20 minutes?', sourceUrl: 'https://www.youtube.com/watch?v=eUrYcHQcf4o'
  },
  {
    id: 'vault-kettlebell-7', name: 'Matrix One-Bell Protocol', emoji: '🕶️', equipment: 'kettlebell', intensity: 'spicy', rounds: 5, workSeconds: 40, restSeconds: 20,
    exercises: ['Single-arm snatches', 'Single-arm thrusters', 'Single-arm rows'],
    sourceTitle: 'One Kettlebell = An Entire Gym', sourceUrl: 'https://www.youtube.com/watch?v=tmX3UZEQdoI'
  },
  { id: 'vault-dumbbells-1', name: 'Dhoom Dumbbell Dhamaka', emoji: '🏍️', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Thrusters', 'Bent-over rows', 'Romanian deadlifts'] },
  { id: 'vault-dumbbells-2', name: 'Munna Bhai Muscle Break', emoji: '😎', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 30, restSeconds: 15, exercises: ['Goblet squats', 'Floor press', 'Alternating rows'] },
  { id: 'vault-dumbbells-3', name: 'Hulk Smash & Dash', emoji: '💚', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Devil press', 'Reverse lunges', 'Renegade rows', 'Thrusters'] },
  { id: 'vault-bands-1', name: "Jadoo's Band Baaja", emoji: '👽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Standing rows', 'Overhead press', 'Lateral walks'] },
  { id: 'vault-bands-2', name: "Vader's Resistance", emoji: '🛸', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded good mornings', 'Split squats', 'Standing rows', 'Overhead press', 'Pallof press'] },
  { id: 'vault-bands-3', name: 'Wonder Woman Snapback', emoji: '⚡', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Skater steps', 'Plank pull-throughs'] }
];

export async function seedVault(workouts: WorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-10-05T00:00:00.000Z';
  for (const seed of seeds) {
    const { sourceTitle: _sourceTitle, sourceUrl: _sourceUrl, ...template } = seed;
    const existing = await workouts.getById(seed.id);
    if (existing?.updatedAt === contentVersion) continue;
    const workout: WorkoutTemplate = {
      ...template,
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
