import { SessionService } from '../src/application/sessionService';
import { WorkoutService } from '../src/application/workoutService';
import { dailyWorkoutIndex, orderWorkoutsForDailyRotation } from '../src/application/dailyWorkout';
import {
  advanceTimer,
  createTimerState,
  nextExercise,
  pauseTimer,
  remainingMs,
  workoutBellCue,
  resumeTimer,
  type WorkoutSnapshot
} from '../src/domain/session';
import type { WorkoutTemplate } from '../src/domain/workout';
import { workoutDurationSeconds } from '../src/domain/workout';
import { seedVault } from '../src/infrastructure/database/seedWorkouts';
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
  startupSeconds: 20,
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
  equal(initial.phase, 'prepare', 'workouts start with a preparation phase');
  equal(remainingMs(initial, 5_000), 15_000, 'preparation time uses the absolute end timestamp');

  const paused = pauseTimer(initial, 5_000);
  equal(paused.pausedRemainingMs, 15_000, 'pause captures exact remaining time');
  equal(remainingMs(paused, 20_000), 15_000, 'paused time does not drift');

  const resumed = resumeTimer(paused, 20_000);
  equal(resumed.intervalEndsAt, 35_000, 'resume creates a new absolute end timestamp');

  const firstWork = advanceTimer(snapshot, initial, 20_000);
  equal(workoutBellCue(initial, firstWork), 'work-start', 'bell rings when the workout starts');

  const roundEnd = advanceTimer(snapshot, firstWork, 50_000);
  equal(workoutBellCue(firstWork, roundEnd), 'rest-start', 'bell rings when a breathe interval starts');

  const nextMovement = advanceTimer(snapshot, roundEnd, 60_000);
  equal(workoutBellCue(roundEnd, nextMovement), 'work-start', 'bell rings when the next movement starts');

  const finalMovement = advanceTimer(snapshot, initial, 60_000);
  const completedRound = advanceTimer(snapshot, finalMovement, 90_000);
  equal(workoutBellCue(finalMovement, completedRound), 'rest-start', 'bell rings when a round finishes and rest starts');

  const nextRound = advanceTimer(snapshot, completedRound, 100_000);
  equal(workoutBellCue(completedRound, nextRound), 'work-start', 'bell rings when the next round starts');

  const afterBackground = advanceTimer(snapshot, initial, 115_000);
  equal(afterBackground.roundIndex, 1, 'background catch-up reaches the correct round');
  equal(afterBackground.exerciseIndex, 0, 'background catch-up reaches the correct exercise');
  equal(afterBackground.phase, 'work', 'background catch-up reaches the correct phase');
  equal(remainingMs(afterBackground, 115_000), 15_000, 'background catch-up preserves interval remainder');

  const complete = advanceTimer(snapshot, initial, 170_000);
  equal(complete.phase, 'complete', 'timer completes after every interval');
  const finalWork = advanceTimer(snapshot, initial, 140_000);
  equal(workoutBellCue(finalWork, complete), 'workout-complete', 'bell rings when the workout finishes');
  equal(workoutDurationSeconds(workout), 170, 'duration includes the one-time preparation period');
  equal(nextExercise(snapshot, { ...initial, phase: 'rest' })?.name, 'Push-ups', 'rest previews the next movement');

  const noDelaySnapshot: WorkoutSnapshot = { ...snapshot, startupSeconds: 0, restSeconds: 0 };
  const noDelayInitial = createTimerState(noDelaySnapshot, 0);
  const immediateWork = advanceTimer(noDelaySnapshot, noDelayInitial, 0);
  equal(immediateWork.phase, 'work', 'zero-second initial start begins work immediately');
  const secondMovement = advanceTimer(noDelaySnapshot, immediateWork, 30_000);
  equal(secondMovement.exerciseIndex, 1, 'zero-second rest advances directly to the next movement');
  const immediateNextRound = advanceTimer(noDelaySnapshot, secondMovement, 60_000);
  equal(workoutBellCue(secondMovement, immediateNextRound), 'work-start', 'zero-second rest still rings for the next round');
}

async function serviceTests() {
  const workouts = new MemoryWorkoutRepository([workout]);
  const sessions = new MemorySessionRepository();
  const sessionService = new SessionService(sessions, workouts);
  const workoutService = new WorkoutService(workouts);

  const session = await sessionService.startWorkout(workout.id, 0);
  equal(session.status, 'active', 'starting a workout creates an active session');
  equal((await sessions.getActive())?.id, session.id, 'active session is persisted');

  const completed = await sessionService.refresh(session, 170_000);
  equal(completed.status, 'completed', 'refresh completes a fully elapsed workout');
  assert(completed.endedAt !== null, 'completed session stores an end time');

  await sessions.deleteHistoryEntry(completed.id);
  equal(await sessions.getById(completed.id), null, 'deleting history removes the persisted session');

  const created = await workoutService.createWorkout({
    name: 'Fresh Start', emoji: '✨', equipment: 'bands', intensity: 'mild',
    rounds: 3, startupSeconds: 5, workSeconds: 30, restSeconds: 0, exercises: ['Rows', 'Squats']
  });
  equal(created.exercises.length, 2, 'workout creation persists every movement');
  equal(created.startupSeconds, 5, 'workout creation stores its one-time start delay');
  equal(created.restSeconds, 0, 'workout creation allows zero-second rests');
  equal((await workouts.getById(created.id))?.name, 'Fresh Start', 'created workout is stored through repository port');

  await workoutService.deleteSavedWorkout(created.id);
  equal(await workouts.getById(created.id), null, 'deleting a custom saved workout removes its template');

  const savedVaultWorkout: WorkoutTemplate = {
    ...workout,
    id: 'vault-saved',
    isVault: true,
    isSaved: true
  };
  await workouts.save(savedVaultWorkout);
  await workoutService.deleteSavedWorkout(savedVaultWorkout.id);
  equal((await workouts.getById(savedVaultWorkout.id))?.isSaved, false, 'deleting a saved Vault workout only removes its saved status');
}

async function vaultSeedTests() {
  const oldVaultWorkout: WorkoutTemplate = {
    ...workout,
    id: 'vault-bodyweight-1',
    name: 'Quickfire Circuit',
    isVault: true,
    isSaved: true,
    updatedAt: new Date(0).toISOString()
  };
  const workouts = new MemoryWorkoutRepository([oldVaultWorkout]);

  await seedVault(workouts);
  const spidey = await workouts.getById('vault-bodyweight-1');
  equal(spidey?.name, 'Spidey Bite 20', 'existing installs receive refreshed Vault names');
  equal(spidey?.isSaved, true, 'Vault refresh preserves the saved state');
  equal(spidey ? workoutDurationSeconds(spidey) : 0, 1210, 'Spidey Bite is approximately twenty minutes including preparation');
  equal((await workouts.listVault()).length, 12, 'Vault contains twelve curated workouts');

  await seedVault(workouts);
  equal((await workouts.listVault()).length, 12, 'Vault refresh is idempotent');
}

async function dailyWorkoutTests() {
  const morning = new Date(2026, 8, 19, 8, 15);
  const evening = new Date(2026, 8, 19, 23, 45);
  const nextDay = new Date(2026, 8, 20, 0, 5);

  const morningIndex = dailyWorkoutIndex(morning, 12);
  equal(dailyWorkoutIndex(evening, 12), morningIndex, 'the workout stays consistent throughout the local calendar day');
  equal(dailyWorkoutIndex(nextDay, 12), (morningIndex + 1) % 12, 'the workout rotates on the next local calendar day');
  equal(dailyWorkoutIndex(morning, 0), -1, 'an empty Vault has no daily workout');

  const reordered = orderWorkoutsForDailyRotation([
    { ...workout, id: 'vault-z' },
    { ...workout, id: 'vault-a' }
  ]);
  equal(reordered[0]?.id, 'vault-a', 'daily rotation order is stable regardless of database update order');
}

async function run() {
  const tests: Array<[string, () => Promise<void>]> = [
    ['absolute timestamp timer', timerTests],
    ['application services', serviceTests],
    ['Vault content refresh', vaultSeedTests],
    ['daily workout selection', dailyWorkoutTests]
  ];
  for (const [name, test] of tests) {
    await test();
    console.log(`✓ ${name}`);
  }
  console.log(`${tests.length} test groups passed`);
}

void run();
