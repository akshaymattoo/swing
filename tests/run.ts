import { SessionService } from '../src/application/sessionService';
import { WorkoutService } from '../src/application/workoutService';
import { VideoWorkoutOfDayService } from '../src/application/videoWorkoutOfDayService';
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
import { completionMessageForSession, completionMessages } from '../src/domain/completionMessages';
import { defaultDailyVideoEquipment, type VideoWorkout } from '../src/domain/videoWorkout';
import { equipmentEmoji, workoutDurationSeconds } from '../src/domain/workout';
import { classifyWorkoutIntensity, movementDemand, workoutDemandScore } from '../src/domain/workoutIntensity';
import { seedVault } from '../src/infrastructure/database/seedWorkouts';
import {
  MemoryDailyVideoWorkoutRepository,
  MemorySessionRepository,
  MemoryVideoWorkoutRepository,
  MemoryWorkoutRepository
} from '../src/infrastructure/memory/MemoryRepositories';
import { swipeDeleteTarget } from '../src/presentation/components/swipeToDelete';
import { formatChannelName, formatVideoFocus } from '../src/presentation/formatters';
import videoCatalog from '../src/infrastructure/database/videoWorkoutCatalog.json';
import approvedVideoIds from '../scripts/approved-video-workout-ids.json';

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

  equal((await sessionService.listHistory()).some((item) => item.id === completed.id), true, 'completed workouts remain in history');

  const created = await workoutService.createWorkout({
    name: 'Fresh Start', emoji: '✨', equipment: 'bands', intensity: 'mild',
    rounds: 3, startupSeconds: 5, workSeconds: 30, restSeconds: 0, exercises: ['Rows', 'Squats']
  });
  equal(created.exercises.length, 2, 'workout creation persists every movement');
  equal(created.startupSeconds, 5, 'workout creation stores its one-time start delay');
  equal(created.restSeconds, 0, 'workout creation allows zero-second rests');
  equal((await workouts.getById(created.id))?.name, 'Fresh Start', 'created workout is stored through repository port');

  const customSession = await sessionService.startWorkout(created.id, 200_000);
  const updated = await workoutService.updateWorkout(created.id, {
    name: 'Fresh Start Remix', emoji: '💫', equipment: 'dumbbells', intensity: 'hot',
    rounds: 5, startupSeconds: 10, workSeconds: 45, restSeconds: 15, exercises: ['Thrusters', 'Lunges', 'Rows']
  });
  equal(updated.id, created.id, 'editing a custom workout preserves its identity');
  equal(updated.name, 'Fresh Start Remix', 'editing a custom workout stores the new name');
  equal(updated.exercises.length, 3, 'editing a custom workout replaces its movements');
  equal(customSession.workoutSnapshot.name, 'Fresh Start', 'editing a workout does not rewrite an existing session snapshot');

  await sessionService.end(customSession, 201_000);

  await workoutService.deleteSavedWorkout(created.id);
  equal(await workouts.getById(created.id), null, 'deleting a custom saved workout removes its template');

  const savedVaultWorkout: WorkoutTemplate = {
    ...workout,
    id: 'vault-saved',
    isVault: true,
    isSaved: true
  };
  await workouts.save(savedVaultWorkout);
  let rejectedVaultEdit = false;
  try {
    await workoutService.updateWorkout(savedVaultWorkout.id, {
      name: 'Changed Vault Workout', emoji: '⚠️', equipment: 'bodyweight', intensity: 'mild',
      rounds: 1, startupSeconds: 0, workSeconds: 5, restSeconds: 0, exercises: ['Squats']
    });
  } catch {
    rejectedVaultEdit = true;
  }
  assert(rejectedVaultEdit, 'Vault workouts must be copied instead of edited directly');
  equal((await workoutService.listSaved()).some((item) => item.id === savedVaultWorkout.id), false, 'Vault workouts do not appear in My Workouts');
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
  equal(spidey?.name, 'Spidey Bite', 'existing installs receive refreshed Vault names');
  equal(spidey?.intensity, 'hot', 'Spidey Bite reflects its high-density intensity');
  equal(spidey?.isSaved, true, 'Vault refresh preserves the saved state');
  equal(spidey ? workoutDurationSeconds(spidey) : 0, 1105, 'Spidey Bite is approximately eighteen minutes including preparation');
  const vault = await workouts.listVault();
  equal(vault.length, 70, 'the seed catalog retains dormant equipment while expanding the active Vault');
  equal(vault.filter((item) => item.equipment === 'bodyweight').length, 25, 'Vault contains twenty-five bodyweight workouts');
  equal(vault.filter((item) => item.equipment === 'kettlebell').length, 25, 'Vault contains twenty-five kettlebell workouts');
  equal(vault.filter((item) => item.equipment === 'dumbbells').length, 10, 'Vault retains ten dormant dumbbell workouts');
  equal(vault.filter((item) => item.equipment === 'bands').length, 10, 'Vault retains ten dormant band workouts');
  assert(vault.every((item) => workoutDurationSeconds(item) >= 600), 'every Vault workout lasts at least ten minutes');
  assert(vault.every((item) => workoutDurationSeconds(item) <= 1_800), 'every Vault workout stays within thirty minutes');
  const casket = vault.find((item) => item.id === 'vault-kettlebell-3');
  equal(casket?.name, "Wick's Last Round", 'Vault workouts use compact creative names');
  equal(casket?.exercises.length, 5, 'full-body Vault workouts cover five easy-to-follow movement patterns');
  assert(vault.every((item) => item.name.length <= 18), 'Vault names stay compact enough for workout cards');

  const visibleVault = await new WorkoutService(workouts).listVault();
  equal(visibleVault.length, 50, 'the MVP Vault presents fifty kettlebell and bodyweight workouts');
  equal(visibleVault.filter((item) => item.equipment === 'bodyweight').length, 25, 'the MVP Vault balances twenty-five bodyweight workouts');
  equal(visibleVault.filter((item) => item.equipment === 'kettlebell').length, 25, 'the MVP Vault balances twenty-five kettlebell workouts');
  assert(visibleVault.every((item) => ['bodyweight', 'kettlebell'].includes(item.equipment)), 'the MVP Vault hides dormant equipment');
  const clearMovements = new Set([
    'Air squats', 'Alternating lunges', 'Bent-over rows', 'Bird dogs', 'Chair squats',
    'Cossack squats', 'Dead bugs', 'Floor press', 'Glute bridges', 'Goblet squats', 'Gorilla rows', 'High knees',
    'Hollow hold', 'Kettlebell cleans', 'Kettlebell deadlifts', 'Kettlebell snatches', 'Kettlebell swings',
    'Kneeling push-ups', 'March in place', 'Mountain climbers', 'Overhead press',
    'Fast squats', 'Plank hold', 'Plank shoulder taps', 'Push-ups', 'Reverse lunges', 'Side lunges', 'Skater steps',
    'Slow squats', 'Standing calf raises', 'Standing knee drives', 'Step-back burpees', 'Step jacks',
    'Sumo squats', 'Superman lifts', 'Supported rows', 'Suitcase march', 'Wall push-ups'
  ]);
  assert(visibleVault.every((item) => item.exercises.every((exercise) => clearMovements.has(exercise.name))), 'every visible movement uses the audited plain-language vocabulary');
  assert(visibleVault.every((item) => item.exercises.every((exercise) => !['Prone swimmers', 'Prone W raises'].includes(exercise.name))), 'unfamiliar prone movement names stay out of the Vault');
  assert(visibleVault.every((item) => item.exercises.every((exercise) => movementDemand[exercise.name] !== undefined)), 'every Vault movement has an explicit demand rating');
  assert(visibleVault.every((item) => item.intensity === classifyWorkoutIntensity({
    equipment: item.equipment,
    rounds: item.rounds,
    workSeconds: item.workSeconds,
    restSeconds: item.restSeconds,
    exercises: item.exercises.map((exercise) => exercise.name)
  })), 'every Vault emoji is derived from the intensity algorithm');
  equal(visibleVault.filter((item) => item.intensity === 'mild').length, 10, 'the algorithm identifies ten mild workouts');
  equal(visibleVault.filter((item) => item.intensity === 'spicy').length, 19, 'the algorithm identifies nineteen spicy workouts');
  equal(visibleVault.filter((item) => item.intensity === 'hot').length, 21, 'the algorithm identifies twenty-one hot workouts');

  const batBase = visibleVault.find((item) => item.id === 'vault-bodyweight-4');
  const deadpool = visibleVault.find((item) => item.id === 'vault-kettlebell-6');
  assert(batBase && deadpool, 'calibration workouts exist');
  assert(workoutDemandScore({ ...batBase, exercises: batBase.exercises.map((exercise) => exercise.name) }) < 48, 'supported low-density work stays mild');
  assert(workoutDemandScore({ ...deadpool, exercises: deadpool.exercises.map((exercise) => exercise.name) }) >= 68, 'loaded technical high-density work stays hot');

  await seedVault(workouts);
  equal((await workouts.listVault()).length, 70, 'Vault refresh is idempotent');
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

async function swipeToDeleteTests() {
  equal(swipeDeleteTarget(-60, 0, 96), -96, 'a row more than halfway open stays open');
  equal(swipeDeleteTarget(-38, 0, 96), -96, 'a deliberate partial swipe exposes the delete action');
  equal(swipeDeleteTarget(-12, 0, 96), 0, 'a small accidental movement closes the row');
  equal(swipeDeleteTarget(-15, -0.5, 96), -96, 'a quick left flick exposes the delete action');
}

async function videoWorkoutOfDayTests() {
  const base: VideoWorkout = {
    id: 'video-a',
    youtubeVideoId: 'a',
    title: 'Workout A',
    channelName: 'Channel',
    youtubeUrl: 'https://www.youtube.com/watch?v=a',
    durationSeconds: 1200,
    equipment: 'kettlebell',
    focus: 'full body',
    publishedText: '1 month ago',
    contentKind: 'follow_along',
    wodEligible: true,
    isActive: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
  };
  const videos = new MemoryVideoWorkoutRepository([
    base,
    { ...base, id: 'video-b', youtubeVideoId: 'b', title: 'Workout B' },
    { ...base, id: 'video-body-a', youtubeVideoId: 'body-a', title: 'Bodyweight A', equipment: 'bodyweight' },
    { ...base, id: 'video-body-b', youtubeVideoId: 'body-b', title: 'Bodyweight B', equipment: 'bodyweight' },
    { ...base, id: 'video-dumbbell', youtubeVideoId: 'd', title: 'Dumbbell Workout', equipment: 'dumbbells' },
    { ...base, id: 'video-ineligible', youtubeVideoId: 'c', title: 'Tutorial', wodEligible: false }
  ]);
  const assignments = new MemoryDailyVideoWorkoutRepository();
  const service = new VideoWorkoutOfDayService(videos, assignments);

  const firstDay = new Date(2026, 8, 29, 8);
  const first = await service.getPairForDate(firstDay);
  const repeated = await service.getPairForDate(new Date(2026, 8, 29, 20));
  equal(repeated.bodyweight?.id, first.bodyweight?.id, 'the same local day keeps its bodyweight assignment');
  equal(repeated.kettlebell?.id, first.kettlebell?.id, 'the same local day keeps its kettlebell assignment');
  assert(first.bodyweight?.equipment === 'bodyweight', 'every day has a bodyweight workout');
  assert(first.kettlebell?.equipment === 'kettlebell', 'every day has a kettlebell workout');
  equal(
    (await service.getForDate(firstDay))?.equipment,
    defaultDailyVideoEquipment(firstDay),
    'the default daily choice alternates deterministically by local date'
  );

  const secondDay = new Date(2026, 8, 30, 8);
  const second = await service.getPairForDate(secondDay);
  assert(second.bodyweight?.id !== first.bodyweight?.id, 'an unseen bodyweight video is selected before repeating one');
  assert(second.kettlebell?.id !== first.kettlebell?.id, 'an unseen kettlebell video is selected before repeating one');
  assert(second.bodyweight?.wodEligible && second.kettlebell?.wodEligible, 'ineligible videos never enter either rotation');
  assert(defaultDailyVideoEquipment(secondDay) !== defaultDailyVideoEquipment(firstDay), 'the initially visible equipment flips each day');

  const third = await service.getPairForDate(new Date(2026, 9, 1, 8));
  equal(third.bodyweight?.id, first.bodyweight?.id, 'bodyweight rotates after exhausting its equipment catalog');
  equal(third.kettlebell?.id, first.kettlebell?.id, 'kettlebell rotates after exhausting its equipment catalog');
  equal((await assignments.listAll()).length, 6, 'two durable assignments are stored per local calendar day');

  const oldDate = new Date(2026, 9, 2, 8);
  const oldDateKey = '2026-10-02';
  const staleAssignments = new MemoryDailyVideoWorkoutRepository([{
    localDate: oldDateKey,
    equipment: 'kettlebell',
    workoutVideoId: 'video-dumbbell',
    selectedAt: oldDate.toISOString()
  }]);
  const replacement = await new VideoWorkoutOfDayService(videos, staleAssignments).getForDate(oldDate, 'kettlebell');
  assert(replacement?.equipment === 'kettlebell', 'a cached assignment using dormant equipment is replaced');
}

async function completionMessageTests() {
  equal(completionMessages.length, 30, 'the completion celebration has thirty messages');
  equal(new Set(completionMessages).size, 30, 'completion messages are unique');
  equal(
    completionMessageForSession('session-stable'),
    completionMessageForSession('session-stable'),
    'a completed session keeps the same message across renders'
  );
  const rotation = new Set(Array.from({ length: 100 }, (_, index) => completionMessageForSession(`session-${index}`)));
  assert(rotation.size >= 25, 'session-based message selection rotates across most of the message library');
}

async function videoCatalogTests() {
  equal(videoCatalog.length, 352, 'the generated catalog includes every qualifying video from workouts_flat.json');
  equal(new Set(videoCatalog.map((video) => video.youtubeVideoId)).size, videoCatalog.length, 'YouTube video IDs are unique');
  assert(videoCatalog.every((video) => !video.youtubeUrl.includes('/shorts/')), 'YouTube Shorts are excluded from the generated catalog');
  assert(videoCatalog.every((video) => ['bodyweight', 'kettlebell'].includes(video.equipment)), 'the source catalog contains only active MVP equipment');
  const eligible = videoCatalog.filter((video) => video.wodEligible);
  equal(eligible.length, 60, 'the daily rotation contains exactly the approved MVP shortlist');
  equal(new Set(approvedVideoIds).size, 60, 'the approval whitelist contains sixty unique videos');
  assert(eligible.every((video) => approvedVideoIds.includes(video.youtubeVideoId)), 'only ranked videos enter the rotation');
  assert(approvedVideoIds.every((id) => eligible.some((video) => video.youtubeVideoId === id)), 'every approved video enters the rotation');
  assert(eligible.every((video) => video.durationSeconds >= 10 * 60 && video.durationSeconds < 40 * 60), 'daily workouts are at least ten and under forty minutes');
  assert(eligible.every((video) => ['bodyweight', 'kettlebell'].includes(video.equipment)), 'approved daily workouts use only MVP equipment');
  equal(eligible.filter((video) => video.equipment === 'kettlebell').length, 30, 'the daily rotation has thirty kettlebell workouts');
  equal(eligible.filter((video) => video.equipment === 'bodyweight').length, 30, 'the daily rotation has thirty bodyweight workouts');
  for (const equipment of ['kettlebell', 'bodyweight'] as const) {
    const expectedTopIds = videoCatalog
      .filter((video) => video.equipment === equipment)
      .sort((left, right) => right.viewCount - left.viewCount || left.youtubeVideoId.localeCompare(right.youtubeVideoId))
      .slice(0, 30)
      .map((video) => video.youtubeVideoId);
    const selectedIds = eligible.filter((video) => video.equipment === equipment).map((video) => video.youtubeVideoId);
    assert(expectedTopIds.every((id) => selectedIds.includes(id)), `the ${equipment} rotation contains the thirty most-viewed qualifying videos`);
  }
  equal(equipmentEmoji('bodyweight'), '🤸', 'bodyweight has a distinct action emoji');
  equal(equipmentEmoji('kettlebell'), '🔔', 'kettlebells have a distinct action emoji');
  equal(equipmentEmoji('dumbbells'), '🏋️', 'dumbbells have a distinct action emoji');
  equal(equipmentEmoji('bands'), '〰️', 'bands have a distinct action emoji');
  equal(formatVideoFocus('full body; EMOM | kettlebell'), 'full body, EMOM, kettlebell', 'video focus uses a compact comma-separated description');
  equal(formatChannelName('Vadim Kettlebell (@vadimkettlebell)'), 'Vadim Kettlebell', 'channel names omit parenthetical handles');
}

async function run() {
  const tests: Array<[string, () => Promise<void>]> = [
    ['absolute timestamp timer', timerTests],
    ['application services', serviceTests],
    ['Vault content refresh', vaultSeedTests],
    ['daily workout selection', dailyWorkoutTests],
    ['swipe-to-delete settling', swipeToDeleteTests],
    ['video workout of the day', videoWorkoutOfDayTests],
    ['completion messages', completionMessageTests],
    ['generated video catalog', videoCatalogTests]
  ];
  for (const [name, test] of tests) {
    await test();
    console.log(`✓ ${name}`);
  }
  console.log(`${tests.length} test groups passed`);
}

void run();
