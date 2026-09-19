import type { WorkoutTemplate } from './workout';

export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type TimerPhase = 'work' | 'rest' | 'complete';

export type WorkoutSnapshot = Pick<
  WorkoutTemplate,
  'id' | 'name' | 'emoji' | 'equipment' | 'intensity' | 'rounds' | 'workSeconds' | 'restSeconds' | 'exercises'
>;

export type TimerState = {
  roundIndex: number;
  exerciseIndex: number;
  phase: TimerPhase;
  intervalEndsAt: number | null;
  pausedRemainingMs: number | null;
};

export type WorkoutSession = {
  id: string;
  workoutTemplateId: string | null;
  workoutSnapshot: WorkoutSnapshot;
  status: SessionStatus;
  timerState: TimerState;
  startedAt: string;
  endedAt: string | null;
};

export function createTimerState(workout: WorkoutSnapshot, now: number): TimerState {
  return {
    roundIndex: 0,
    exerciseIndex: 0,
    phase: 'work',
    intervalEndsAt: now + workout.workSeconds * 1000,
    pausedRemainingMs: null
  };
}

export function remainingMs(state: TimerState, now: number) {
  if (state.phase === 'complete') return 0;
  if (state.pausedRemainingMs !== null) return state.pausedRemainingMs;
  return Math.max(0, (state.intervalEndsAt ?? now) - now);
}

export function pauseTimer(state: TimerState, now: number): TimerState {
  if (state.phase === 'complete' || state.pausedRemainingMs !== null) return state;
  return { ...state, intervalEndsAt: null, pausedRemainingMs: remainingMs(state, now) };
}

export function resumeTimer(state: TimerState, now: number): TimerState {
  if (state.phase === 'complete' || state.pausedRemainingMs === null) return state;
  return { ...state, intervalEndsAt: now + state.pausedRemainingMs, pausedRemainingMs: null };
}

function nextInterval(workout: WorkoutSnapshot, state: TimerState, startsAt: number): TimerState {
  if (state.phase === 'work') {
    const finalExercise = state.exerciseIndex === workout.exercises.length - 1;
    const finalRound = state.roundIndex === workout.rounds - 1;
    if (finalExercise && finalRound) {
      return { ...state, phase: 'complete', intervalEndsAt: null, pausedRemainingMs: null };
    }
    return {
      ...state,
      phase: 'rest',
      intervalEndsAt: startsAt + workout.restSeconds * 1000,
      pausedRemainingMs: null
    };
  }

  const finalExercise = state.exerciseIndex === workout.exercises.length - 1;
  return {
    roundIndex: finalExercise ? state.roundIndex + 1 : state.roundIndex,
    exerciseIndex: finalExercise ? 0 : state.exerciseIndex + 1,
    phase: 'work',
    intervalEndsAt: startsAt + workout.workSeconds * 1000,
    pausedRemainingMs: null
  };
}

export function advanceTimer(workout: WorkoutSnapshot, state: TimerState, now: number): TimerState {
  if (state.phase === 'complete' || state.pausedRemainingMs !== null) return state;

  let next = state;
  while (next.phase !== 'complete' && next.intervalEndsAt !== null && now >= next.intervalEndsAt) {
    next = nextInterval(workout, next, next.intervalEndsAt);
  }
  return next;
}

export function skipInterval(workout: WorkoutSnapshot, state: TimerState, now: number): TimerState {
  if (state.phase === 'complete') return state;
  return nextInterval(workout, { ...state, pausedRemainingMs: null }, now);
}

export function currentExercise(workout: WorkoutSnapshot, state: TimerState) {
  return workout.exercises[state.exerciseIndex] ?? null;
}

export function nextExercise(workout: WorkoutSnapshot, state: TimerState) {
  const isLast = state.exerciseIndex === workout.exercises.length - 1;
  if (isLast && state.roundIndex === workout.rounds - 1) return null;
  return workout.exercises[isLast ? 0 : state.exerciseIndex + 1] ?? null;
}
