import type { WorkoutTemplate } from '../domain/workout';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function orderWorkoutsForDailyRotation(workouts: WorkoutTemplate[]) {
  return [...workouts].sort((left, right) => left.id.localeCompare(right.id));
}

export function dailyWorkoutIndex(date: Date, workoutCount: number) {
  if (workoutCount <= 0) return -1;

  const localCalendarDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localCalendarDay / MILLISECONDS_PER_DAY) % workoutCount;
}
