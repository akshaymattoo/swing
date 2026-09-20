import { SessionService } from '../src/application/sessionService';
import { WorkoutService } from '../src/application/workoutService';
import {
  advanceTimer,
  createTimerState,
  nextExercise,
  pauseTimer,
  remainingMs,
  resumeTimer,
  type WorkoutSnapshot
} from '../src/domain/session';
import type { WorkoutTemplate } from '../src/domain/workout';
import { workoutDurationSeconds } from '../src/domain/workout';
import { MemorySessionRepository, MemoryWorkoutRepository } from '../src/infrastructure/memory/MemoryRepositories';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`);
}

const workout: WorkoutTemplate = {
  id: 'workout-1',
  name: 'Timer Test',
  emoji: '⏱️',
  equipment: 'bodyweight',
  intensity: 'spicy',
  rounds: 2,
  workSeconds: 30,
  restSeconds: 10,
  exercises: [
    { id: 'exercise-1', name: 'Squats', position: 0 },
    { id: 'exercise-2', name: 'Push-ups', position: 1 }
  ],
  isVault: false,
  isSaved: true,
  sourceTemplateId: null,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
};

async function timerTests() {
  const snapshot: WorkoutSnapshot = workout;
  const initial = createTimerState(snapshot, 0);
  equal(remainingMs(initial, 5_000), 25_000, 'remaining time uses the absolute end timestamp');

  const paused = pauseTimer(initial, 5_000);
  equal(paused.pausedRemainingMs, 25_000, 'pause captures exact remaining time');
  equal(remainingMs(paused, 20_000), 25_000, 'paused time does not drift');

  const resumed = resumeTimer(paused, 20_000);
  equal(resumed.intervalEndsAt, 45_000, 'resume creates a new absolute end timestamp');

  const afterBackground = advanceTimer(snapshot, initial, 95_000);
  equal(afterBackground.roundIndex, 1, 'background catch-up reaches the correct round');
  equal(afterBackground.exerciseIndex, 0, 'background catch-up reaches the correct exercise');
  equal(afterBackground.phase, 'work', 'background catch-up reaches the correct phase');
  equal(remainingMs(afterBackground, 95_000), 15_000, 'background catch-up preserves interval remainder');

  const complete = advanceTimer(snapshot, initial, 150_000);
  equal(complete.phase, 'complete', 'timer completes after every interval');
  equal(workoutDurationSeconds(workout), 150, 'duration matches timer sequence');
  equal(nextExercise(snapshot, { ...initial, phase: 'rest' })?.name, 'Push-ups', 'rest previews the next movement');
}

async function serviceTests() {
  const workouts = new MemoryWorkoutRepository([workout]);
  const sessions = new MemorySessionRepository();
  const sessionService = new SessionService(sessions, workouts);
  const workoutService = new WorkoutService(workouts);

  const session = await sessionService.startWorkout(workout.id, 0);
  equal(session.status, 'active', 'starting a workout creates an active session');
  equal((await sessions.getActive())?.id, session.id, 'active session is persisted');

  const completed = await sessionService.refresh(session, 150_000);
  equal(completed.status, 'completed', 'refresh completes a fully elapsed workout');
  assert(completed.endedAt !== null, 'completed session stores an end time');

  await sessionService.deleteHistoryEntry(completed.id);
  equal(await sessions.getById(completed.id), null, 'deleting history removes the persisted session');

  const created = await workoutService.createWorkout({
    name: 'Fresh Start', emoji: '✨', equipment: 'bands', intensity: 'mild',
    rounds: 3, workSeconds: 30, restSeconds: 15, exercises: ['Rows', 'Squats']
  });
  equal(created.exercises.length, 2, 'workout creation persists every movement');
  equal((await workouts.getById(created.id))?.name, 'Fresh Start', 'created workout is stored through repository port');
}

async function run() {
  const tests: Array<[string, () => Promise<void>]> = [
    ['absolute timestamp timer', timerTests],
    ['application services', serviceTests]
  ];
  for (const [name, test] of tests) {
    await test();
    console.log(`✓ ${name}`);
  }
  console.log(`${tests.length} test groups passed`);
}

void run();
