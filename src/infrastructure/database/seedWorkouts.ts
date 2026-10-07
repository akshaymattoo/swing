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

// Intensity rubric for Vault curation:
// Mild: controlled, low-impact patterns with generous recovery and beginner-friendly complexity.
// Spicy: sustained full-body work with moderate density or one demanding compound pattern.
// Hot: short recovery plus explosive, ballistic, or repeated multi-joint work that is hard to sustain.
const seeds: Seed[] = [
  { id: 'vault-bodyweight-1', name: 'Spidey Bite', emoji: '🕷️', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Push-ups', 'Air squats', 'Mountain climbers', 'Superman lifts'] },
  { id: 'vault-bodyweight-2', name: 'Mogambo Mayhem', emoji: '😈', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 20, exercises: ['Air squats', 'Kneeling push-ups', 'Reverse lunges', 'Dead bugs', 'High knees'] },
  { id: 'vault-bodyweight-3', name: 'Krrish Kalesh', emoji: '🌪️', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Fast squats', 'Push-ups', 'High knees', 'Glute bridges', 'Plank shoulder taps'] },
  { id: 'vault-bodyweight-4', name: 'Bat Base', emoji: '🦇', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 25, exercises: ['Air squats', 'Wall push-ups', 'Glute bridges', 'Bird dogs', 'Standing knee drives'] },
  { id: 'vault-bodyweight-5', name: 'Pushpa Fire', emoji: '🌺', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Air squats', 'Push-ups', 'Reverse lunges', 'Superman lifts', 'Plank shoulder taps'] },
  { id: 'vault-bodyweight-6', name: 'Panther Pounce', emoji: '🐾', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Skater steps', 'Push-ups', 'Alternating lunges', 'Superman lifts', 'Mountain climbers'] },
  { id: 'vault-bodyweight-7', name: 'Zindagi Zen', emoji: '🌤️', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Slow squats', 'Kneeling push-ups', 'Glute bridges', 'Bird dogs', 'Dead bugs'] },
  { id: 'vault-bodyweight-8', name: 'Rocky Rumble', emoji: '🥊', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Step-back burpees', 'Push-ups', 'Alternating lunges', 'Superman lifts', 'Hollow hold'] },
  { id: 'vault-bodyweight-9', name: 'Hanuman Hustle', emoji: '🔥', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 35, restSeconds: 15, exercises: ['Step-back burpees', 'Kneeling push-ups', 'Reverse lunges', 'Superman lifts', 'Mountain climbers'] },
  { id: 'vault-bodyweight-10', name: 'Wednesday Walk', emoji: '🖤', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Side lunges', 'Wall push-ups', 'Glute bridges', 'Bird dogs', 'Standing knee drives'] },
  { id: 'vault-bodyweight-11', name: 'Neo No Gear', emoji: '🕶️', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Air squats', 'Push-ups', 'Alternating lunges', 'Dead bugs', 'Step jacks'] },
  { id: 'vault-bodyweight-12', name: 'Barbie Bounce', emoji: '💖', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 20, exercises: ['Sumo squats', 'Kneeling push-ups', 'Glute bridges', 'Plank shoulder taps', 'High knees'] },
  { id: 'vault-bodyweight-13', name: 'Mando Basics', emoji: '🪐', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Chair squats', 'Wall push-ups', 'Standing calf raises', 'Bird dogs', 'March in place'] },
  { id: 'vault-bodyweight-14', name: 'Dhoom Dash', emoji: '🏍️', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Fast squats', 'Push-ups', 'Mountain climbers', 'Alternating lunges', 'High knees'] },
  { id: 'vault-bodyweight-15', name: 'Gully Groove', emoji: '🎤', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Air squats', 'Kneeling push-ups', 'Side lunges', 'Superman lifts', 'Step jacks'] },
  { id: 'vault-bodyweight-16', name: 'Jadoo Jumpstart', emoji: '👽', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 25, exercises: ['Chair squats', 'Wall push-ups', 'Glute bridges', 'Dead bugs', 'March in place'] },
  { id: 'vault-bodyweight-17', name: 'Thor Thunder', emoji: '🔨', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Step-back burpees', 'Push-ups', 'Air squats', 'Plank shoulder taps', 'High knees'] },
  { id: 'vault-bodyweight-18', name: 'Queen Circuit', emoji: '👑', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Sumo squats', 'Kneeling push-ups', 'Reverse lunges', 'Bird dogs', 'Mountain climbers'] },
  { id: 'vault-bodyweight-19', name: 'Hulk at Home', emoji: '💚', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Fast squats', 'Push-ups', 'Reverse lunges', 'Superman lifts', 'Mountain climbers'] },
  { id: 'vault-bodyweight-20', name: 'Lasso Light', emoji: '⚽', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Air squats', 'Wall push-ups', 'Glute bridges', 'Bird dogs', 'Step jacks'] },
  { id: 'vault-bodyweight-21', name: 'Furiosa Flow', emoji: '🏜️', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 35, restSeconds: 20, exercises: ['Air squats', 'Push-ups', 'Alternating lunges', 'Dead bugs', 'High knees'] },
  { id: 'vault-bodyweight-22', name: 'RRR Rush', emoji: '🐯', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Step-back burpees', 'Air squats', 'Push-ups', 'Mountain climbers', 'Glute bridges'] },
  { id: 'vault-bodyweight-23', name: 'Kantara Calm', emoji: '🌲', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Slow squats', 'Wall push-ups', 'Reverse lunges', 'Bird dogs', 'March in place'] },
  { id: 'vault-bodyweight-24', name: 'Marvel Move', emoji: '✨', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Sumo squats', 'Kneeling push-ups', 'Cossack squats', 'Superman lifts', 'Plank shoulder taps'] },
  { id: 'vault-bodyweight-25', name: 'Singham Sprint', emoji: '🦁', equipment: 'bodyweight', intensity: 'hot', rounds: 4, workSeconds: 35, restSeconds: 15, exercises: ['Fast squats', 'Push-ups', 'Alternating lunges', 'Mountain climbers', 'High knees'] },
  { id: 'vault-kettlebell-1', name: 'Rocky Bell', emoji: '🥊', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Suitcase march'] },
  { id: 'vault-kettlebell-2', name: 'Pathaan Fury', emoji: '🔥', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Floor press', 'Suitcase march'] },
  { id: 'vault-kettlebell-3', name: 'Wick Circuit', emoji: '🪦', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Gorilla rows', 'Overhead press', 'Mountain climbers'] },
  { id: 'vault-kettlebell-4', name: 'Shaktimaan Bell', emoji: '⚡', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Reverse lunges', 'Bent-over rows', 'Overhead press', 'Suitcase march'] },
  { id: 'vault-kettlebell-5', name: 'Avengers Bell', emoji: '🛡️', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Push-ups', 'Suitcase march'] },
  { id: 'vault-kettlebell-6', name: 'Deadpool Bell', emoji: '🌮', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell snatches', 'Reverse lunges', 'Bent-over rows', 'Floor press', 'Mountain climbers'] },
  { id: 'vault-kettlebell-7', name: 'Matrix Bell', emoji: '🕶️', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Dead bugs'] },
  { id: 'vault-kettlebell-8', name: 'Baahubali Bell', emoji: '⚔️', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Suitcase march'] },
  { id: 'vault-kettlebell-9', name: 'Mando March', emoji: '🪐', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Chair squats', 'Supported rows', 'Floor press', 'Suitcase march'] },
  { id: 'vault-kettlebell-10', name: 'Gadar Bell', emoji: '🚂', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell cleans', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'High knees'] },
  { id: 'vault-kettlebell-11', name: 'Barbie Bell', emoji: '💖', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Supported rows', 'Floor press', 'March in place'] },
  { id: 'vault-kettlebell-12', name: 'Thor Bell', emoji: '🔨', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Glute bridges'] },
  { id: 'vault-kettlebell-13', name: 'Jadoo Bell', emoji: '👽', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Chair squats', 'Supported rows', 'Floor press', 'Suitcase march'] },
  { id: 'vault-kettlebell-14', name: 'Dhoom Bell', emoji: '🏍️', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Reverse lunges', 'Bent-over rows', 'Push-ups', 'High knees'] },
  { id: 'vault-kettlebell-15', name: 'Gully Bell', emoji: '🎤', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Dead bugs'] },
  { id: 'vault-kettlebell-16', name: 'Panther Bell', emoji: '🐾', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Floor press', 'Mountain climbers'] },
  { id: 'vault-kettlebell-17', name: 'Queen Bell', emoji: '👑', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Reverse lunges', 'Supported rows', 'Floor press', 'Suitcase march'] },
  { id: 'vault-kettlebell-18', name: 'Hulk Bell', emoji: '💚', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Mountain climbers'] },
  { id: 'vault-kettlebell-19', name: 'Lasso Bell', emoji: '⚽', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Chair squats', 'Supported rows', 'Floor press', 'March in place'] },
  { id: 'vault-kettlebell-20', name: 'Furiosa Bell', emoji: '🏜️', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell swings', 'Reverse lunges', 'Bent-over rows', 'Overhead press', 'Suitcase march'] },
  { id: 'vault-kettlebell-21', name: 'RRR Bell', emoji: '🐯', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Goblet squats', 'Bent-over rows', 'Push-ups', 'High knees'] },
  { id: 'vault-kettlebell-22', name: 'Kantara Bell', emoji: '🌲', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 25, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Supported rows', 'Floor press', 'Bird dogs'] },
  { id: 'vault-kettlebell-23', name: 'Marvel Bell', emoji: '✨', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Bent-over rows', 'Overhead press', 'Plank shoulder taps'] },
  { id: 'vault-kettlebell-24', name: 'Singham Bell', emoji: '🦁', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Reverse lunges', 'Bent-over rows', 'Floor press', 'Mountain climbers'] },
  { id: 'vault-kettlebell-25', name: 'Pushpa Bell', emoji: '🌺', equipment: 'kettlebell', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Bent-over rows', 'Push-ups', 'Suitcase march'] },
  { id: 'vault-dumbbells-1', name: 'Dhoom Dhamaka', emoji: '🏍️', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Thrusters', 'Bent-over rows', 'Romanian deadlifts'] },
  { id: 'vault-dumbbells-2', name: 'Munna Muscle', emoji: '😎', equipment: 'dumbbells', intensity: 'mild', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Floor press', 'Alternating rows'] },
  { id: 'vault-dumbbells-3', name: 'Hulk Havoc', emoji: '💚', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Devil press', 'Reverse lunges', 'Renegade rows', 'Thrusters'] },
  { id: 'vault-dumbbells-4', name: 'Barbie Strong', emoji: '💖', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Dumbbell floor press', 'Bent-over rows', 'Romanian deadlifts', 'Dead bug pullovers'] },
  { id: 'vault-dumbbells-5', name: 'Thor Trouble', emoji: '🔨', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Dumbbell thrusters', 'Renegade rows', 'Reverse lunges', 'Devil press', 'Farmer march'] },
  { id: 'vault-dumbbells-6', name: "Queen's Darbar", emoji: '👑', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Sumo squats', 'Single-arm rows', 'Alternating floor press', 'Romanian deadlifts', 'Front-rack march'] },
  { id: 'vault-dumbbells-7', name: 'Marvel Charge', emoji: '✨', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Squat cleans', 'Push press', 'Renegade rows', 'Lateral lunges', 'Plank dumbbell drags'] },
  { id: 'vault-dumbbells-8', name: 'Dil Chahta Fit', emoji: '🏖️', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Supported rows', 'Floor press', 'Kickstand Romanian deadlifts', 'Farmer march'] },
  { id: 'vault-dumbbells-9', name: 'Furiosa Fury', emoji: '🏜️', equipment: 'dumbbells', intensity: 'hot', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Dumbbell deadlifts', 'Hang cleans', 'Front squats', 'Push press', 'Bent-over rows'] },
  { id: 'vault-dumbbells-10', name: 'Singham Duty', emoji: '🦁', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 35, restSeconds: 15, exercises: ['Devil press', 'Front-rack reverse lunges', 'Alternating rows', 'Goblet squats', 'Bear-plank drags'] },
  { id: 'vault-bands-1', name: 'Jadoo Jolt', emoji: '👽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Standing rows', 'Overhead press', 'Lateral walks'] },
  { id: 'vault-bands-2', name: 'Vader Resistance', emoji: '🛸', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded good mornings', 'Split squats', 'Standing rows', 'Overhead press', 'Pallof press'] },
  { id: 'vault-bands-3', name: 'Wonder Whip', emoji: '⚡', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Skater steps', 'Plank pull-throughs'] },
  { id: 'vault-bands-4', name: 'Mr India Elastic', emoji: '🫥', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Banded squats', 'Banded good mornings', 'Seated rows', 'Standing chest press', 'Pallof press'] },
  { id: 'vault-bands-5', name: 'RRR Revolt', emoji: '🐯', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Reverse lunges with press', 'Banded deadlifts', 'Bear-plank band pulls'] },
  { id: 'vault-bands-6', name: 'Neo Matrix', emoji: '💊', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded Romanian deadlifts', 'Squat to row', 'Split-stance chest press', 'Half-kneeling pull-downs', 'Pallof press'] },
  { id: 'vault-bands-7', name: 'Gully Grind', emoji: '🎤', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Front squats', 'Seated rows', 'Overhead press', 'Lateral walks', 'Dead bug pull-downs'] },
  { id: 'vault-bands-8', name: 'Dangal Tension', emoji: '🤼', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded deadlifts', 'Split squats', 'Bent-over rows', 'Band-resisted push-ups', 'Standing wood chops'] },
  { id: 'vault-bands-9', name: 'Lasso Light', emoji: '⚽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Seated rows', 'Standing chest press', 'Banded good mornings', 'Banded march'] },
  { id: 'vault-bands-10', name: 'Kantara Strength', emoji: '🌲', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded sumo deadlifts', 'Lateral lunges', 'Single-arm rows', 'Overhead press', 'Anti-rotation walkouts'] }
];

export async function seedVault(workouts: WorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-10-06T20:00:00.000Z';
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
