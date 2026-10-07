import type { Equipment, Intensity } from './workout';

export type IntensityInput = {
  equipment: Equipment;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  exercises: readonly string[];
};

// Relative movement demand for an average recreational adult:
// 1 = supported/low-impact, 2 = standard compound work, 3 = technical/high-output.
export const movementDemand: Readonly<Record<string, number>> = {
  'Wall push-ups': 1,
  'Chair squats': 1,
  'March in place': 1,
  'Bird dogs': 1,
  'Dead bugs': 1,
  'Glute bridges': 1,
  'Supported rows': 1,
  'Standing calf raises': 1,
  'Slow squats': 1,
  'Standing knee drives': 1,
  'Step jacks': 1.2,
  'Superman lifts': 1.3,
  'Kneeling push-ups': 1.4,
  'Air squats': 1.5,
  'Plank hold': 1.5,
  'Suitcase march': 1.5,
  'Sumo squats': 1.6,
  'Reverse lunges': 1.7,
  'Side lunges': 1.7,
  'Kettlebell deadlifts': 1.7,
  'Alternating lunges': 1.8,
  'Bent-over rows': 1.8,
  'Floor press': 1.8,
  'Fast squats': 2,
  'Skater steps': 2,
  'Plank shoulder taps': 2,
  'Goblet squats': 2,
  'Overhead press': 2,
  'Push-ups': 2.2,
  'High knees': 2.2,
  'Gorilla rows': 2.4,
  'Hollow hold': 2.4,
  'Mountain climbers': 2.5,
  'Cossack squats': 2.5,
  'Kettlebell swings': 2.5,
  'Kettlebell cleans': 2.7,
  'Step-back burpees': 2.8,
  'Kettlebell snatches': 3
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function workoutDemandScore(input: IntensityInput) {
  if (input.exercises.length === 0) return 0;
  const demands = input.exercises.map((exercise) => movementDemand[exercise] ?? 1.5);
  const averageDemand = demands.reduce((total, demand) => total + demand, 0) / demands.length;
  const peakDemand = Math.max(...demands);
  const movementPoints = (averageDemand / 3) * 35 + (peakDemand / 3) * 10;

  const workDensity = input.workSeconds / Math.max(1, input.workSeconds + input.restSeconds);
  const densityPoints = clamp01((workDensity - 0.5) / 0.25) * 25;

  const activeWorkSeconds = input.rounds * input.exercises.length * input.workSeconds;
  const volumePoints = clamp01((activeWorkSeconds - 400) / 600) * 20;
  const roundPoints = clamp01((input.rounds - 2) / 3) * 5;
  const loadPoints = input.equipment === 'kettlebell' ? 5 : 0;

  return Math.round(movementPoints + densityPoints + volumePoints + roundPoints + loadPoints);
}

export function classifyWorkoutIntensity(input: IntensityInput): Intensity {
  const score = workoutDemandScore(input);
  if (score < 48) return 'mild';
  if (score < 68) return 'spicy';
  return 'hot';
}
