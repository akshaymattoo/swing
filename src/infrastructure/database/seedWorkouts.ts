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
  { id: 'vault-bodyweight-4', name: "Batman's No-Gear Begins", emoji: '🦇', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Bodyweight good mornings', 'Air squats', 'Push-ups', 'Prone W raises', 'Dead bugs'] },
  { id: 'vault-bodyweight-5', name: 'Pushpa Floor Fire', emoji: '🌺', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Squat to knee drive', 'Hand-release push-ups', 'Bear crawls', 'Single-leg glute bridges', 'Plank shoulder taps'] },
  { id: 'vault-bodyweight-6', name: 'Black Panther Pounce', emoji: '🐾', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Skater hops', 'Push-up to rotation', 'Split squats', 'Superman pull-downs', 'Mountain climbers'] },
  { id: 'vault-bodyweight-7', name: 'Zindagi Full-Body Milegi', emoji: '🌤️', equipment: 'bodyweight', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Tempo squats', 'Kneeling push-ups', 'Reverse snow angels', 'Glute bridge march', 'Bird dogs'] },
  { id: 'vault-bodyweight-8', name: 'Rocky Balcony Training', emoji: '🥊', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Squat thrusts', 'Push-ups', 'Alternating lunges', 'Prone swimmers', 'Hollow hold'] },
  { id: 'vault-bodyweight-9', name: 'Hanuman Hustle', emoji: '🔥', equipment: 'bodyweight', intensity: 'hot', rounds: 5, workSeconds: 35, restSeconds: 15, exercises: ['Burpees', 'Pike push-ups', 'Jump lunges', 'Superman pull-downs', 'Plank knee drives'] },
  { id: 'vault-bodyweight-10', name: "Wednesday's Quiet Chaos", emoji: '🖤', equipment: 'bodyweight', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Cossack squats', 'Slow push-ups', 'Crab toe touches', 'Reverse plank marches', 'Dead bugs'] },
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
  { id: 'vault-kettlebell-8', name: 'Baahubali Armor Complex', emoji: '⚔️', equipment: 'kettlebell', intensity: 'hot', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Kettlebell deadlifts', 'Kettlebell swings', 'Clean and press', 'Front-rack squats', 'Single-arm rows', 'Suitcase march'] },
  { id: 'vault-kettlebell-9', name: 'Mandalorian Carry Code', emoji: '🪐', equipment: 'kettlebell', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Kettlebell deadlifts', 'Goblet squats', 'Half-kneeling press', 'Supported rows', 'Suitcase march'] },
  { id: 'vault-kettlebell-10', name: 'Gadar Bell Rebellion', emoji: '🚂', equipment: 'kettlebell', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Kettlebell swings', 'Alternating cleans', 'Push press', 'Front-rack reverse lunges', 'Gorilla rows'] },
  { id: 'vault-dumbbells-1', name: 'Dhoom Dumbbell Dhamaka', emoji: '🏍️', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Thrusters', 'Bent-over rows', 'Romanian deadlifts'] },
  { id: 'vault-dumbbells-2', name: 'Munna Bhai Muscle Break', emoji: '😎', equipment: 'dumbbells', intensity: 'mild', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Floor press', 'Alternating rows'] },
  { id: 'vault-dumbbells-3', name: 'Hulk Smash & Dash', emoji: '💚', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 45, restSeconds: 15, exercises: ['Devil press', 'Reverse lunges', 'Renegade rows', 'Thrusters'] },
  { id: 'vault-dumbbells-4', name: 'Barbie Strong Era', emoji: '💖', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Dumbbell floor press', 'Bent-over rows', 'Romanian deadlifts', 'Dead bug pullovers'] },
  { id: 'vault-dumbbells-5', name: 'Thor Double Trouble', emoji: '🔨', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Dumbbell thrusters', 'Renegade rows', 'Reverse lunges', 'Devil press', 'Farmer march'] },
  { id: 'vault-dumbbells-6', name: "Queen's Dumbbell Darbar", emoji: '👑', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Sumo squats', 'Single-arm rows', 'Alternating floor press', 'Romanian deadlifts', 'Front-rack march'] },
  { id: 'vault-dumbbells-7', name: 'Captain Marvel Power Hour', emoji: '✨', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Squat cleans', 'Push press', 'Renegade rows', 'Lateral lunges', 'Plank dumbbell drags'] },
  { id: 'vault-dumbbells-8', name: 'Dil Chahta Hai Full-Body', emoji: '🏖️', equipment: 'dumbbells', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Goblet squats', 'Supported rows', 'Floor press', 'Kickstand Romanian deadlifts', 'Farmer march'] },
  { id: 'vault-dumbbells-9', name: 'Furiosa Road Warrior', emoji: '🏜️', equipment: 'dumbbells', intensity: 'spicy', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Dumbbell deadlifts', 'Hang cleans', 'Front squats', 'Push press', 'Bent-over rows'] },
  { id: 'vault-dumbbells-10', name: 'Singham Double-Duty', emoji: '🦁', equipment: 'dumbbells', intensity: 'hot', rounds: 5, workSeconds: 35, restSeconds: 15, exercises: ['Devil press', 'Front-rack reverse lunges', 'Alternating rows', 'Goblet squats', 'Bear-plank drags'] },
  { id: 'vault-bands-1', name: "Jadoo's Band Baaja", emoji: '👽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Standing rows', 'Overhead press', 'Lateral walks'] },
  { id: 'vault-bands-2', name: "Vader's Resistance", emoji: '🛸', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded good mornings', 'Split squats', 'Standing rows', 'Overhead press', 'Pallof press'] },
  { id: 'vault-bands-3', name: 'Wonder Woman Snapback', emoji: '⚡', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Skater steps', 'Plank pull-throughs'] },
  { id: 'vault-bands-4', name: 'Elastic Mr India', emoji: '🫥', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 40, restSeconds: 20, exercises: ['Banded squats', 'Banded good mornings', 'Seated rows', 'Standing chest press', 'Pallof press'] },
  { id: 'vault-bands-5', name: 'RRR Resistance Revolt', emoji: '🐯', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded thrusters', 'Speed rows', 'Reverse lunges with press', 'Banded deadlifts', 'Bear-plank band pulls'] },
  { id: 'vault-bands-6', name: "Neo's Band Matrix", emoji: '💊', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded Romanian deadlifts', 'Squat to row', 'Split-stance chest press', 'Half-kneeling pull-downs', 'Pallof press'] },
  { id: 'vault-bands-7', name: 'Gully Boy Pull & Push', emoji: '🎤', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 45, restSeconds: 15, exercises: ['Front squats', 'Seated rows', 'Overhead press', 'Lateral walks', 'Dead bug pull-downs'] },
  { id: 'vault-bands-8', name: 'Dangal Total Tension', emoji: '🤼', equipment: 'bands', intensity: 'hot', rounds: 5, workSeconds: 40, restSeconds: 15, exercises: ['Banded deadlifts', 'Split squats', 'Bent-over rows', 'Band-resisted push-ups', 'Standing wood chops'] },
  { id: 'vault-bands-9', name: 'Ted Lasso Easy Does It', emoji: '⚽', equipment: 'bands', intensity: 'mild', rounds: 3, workSeconds: 35, restSeconds: 20, exercises: ['Banded squats', 'Seated rows', 'Standing chest press', 'Banded good mornings', 'Banded march'] },
  { id: 'vault-bands-10', name: 'Kantara Forest Strength', emoji: '🌲', equipment: 'bands', intensity: 'spicy', rounds: 4, workSeconds: 40, restSeconds: 20, exercises: ['Banded sumo deadlifts', 'Lateral lunges', 'Single-arm rows', 'Overhead press', 'Anti-rotation walkouts'] }
];

export async function seedVault(workouts: WorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-10-05T12:00:00.000Z';
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
