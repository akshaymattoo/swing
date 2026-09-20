import { createId } from '../domain/id';
import {
  advanceTimer,
  createTimerState,
  pauseTimer,
  resumeTimer,
  skipInterval,
  type WorkoutSession,
  type WorkoutSnapshot
} from '../domain/session';
import type { SessionRepository, WorkoutRepository } from './ports';

export class SessionService {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly workouts: WorkoutRepository
  ) {}

  listHistory(limit = 50) {
    return this.sessions.listRecent(limit);
  }

  getActiveSession() {
    return this.sessions.getActive();
  }

  async deleteHistoryEntry(id: string) {
    const session = await this.sessions.getById(id);
    if (!session) return;
    if (session.status === 'active') throw new Error('An active workout cannot be deleted');
    await this.sessions.deleteById(id);
  }

  async startWorkout(workoutId: string, now = Date.now()) {
    const workout = await this.workouts.getById(workoutId);
    if (!workout) throw new Error('Workout not found');
    const existing = await this.sessions.getActive();
    if (existing) {
      await this.sessions.save({ ...existing, status: 'abandoned', endedAt: new Date(now).toISOString() });
    }

    const snapshot: WorkoutSnapshot = {
      id: workout.id,
      name: workout.name,
      emoji: workout.emoji,
      equipment: workout.equipment,
      intensity: workout.intensity,
      rounds: workout.rounds,
      startupSeconds: workout.startupSeconds,
      workSeconds: workout.workSeconds,
      restSeconds: workout.restSeconds,
      exercises: workout.exercises
    };

    const session: WorkoutSession = {
      id: createId('session', now),
      workoutTemplateId: workout.id,
      workoutSnapshot: snapshot,
      status: 'active',
      timerState: createTimerState(snapshot, now),
      startedAt: new Date(now).toISOString(),
      endedAt: null
    };
    await this.sessions.save(session);
    return session;
  }

  async refresh(session: WorkoutSession, now = Date.now()) {
    const timerState = advanceTimer(session.workoutSnapshot, session.timerState, now);
    const status = timerState.phase === 'complete' ? 'completed' : session.status;
    const updated: WorkoutSession = {
      ...session,
      timerState,
      status,
      endedAt: status === 'completed' ? session.endedAt ?? new Date(now).toISOString() : session.endedAt
    };
    if (updated.timerState !== session.timerState || updated.status !== session.status) {
      await this.sessions.save(updated);
    }
    return updated;
  }

  async pause(session: WorkoutSession, now = Date.now()) {
    return this.persist({ ...session, timerState: pauseTimer(session.timerState, now) });
  }

  async resume(session: WorkoutSession, now = Date.now()) {
    return this.persist({ ...session, timerState: resumeTimer(session.timerState, now) });
  }

  async skip(session: WorkoutSession, now = Date.now()) {
    const timerState = skipInterval(session.workoutSnapshot, session.timerState, now);
    return this.persist({
      ...session,
      timerState,
      status: timerState.phase === 'complete' ? 'completed' : session.status,
      endedAt: timerState.phase === 'complete' ? new Date(now).toISOString() : session.endedAt
    });
  }

  async end(session: WorkoutSession, now = Date.now()) {
    return this.persist({
      ...session,
      status: 'abandoned',
      endedAt: new Date(now).toISOString(),
      timerState: { ...session.timerState, intervalEndsAt: null, pausedRemainingMs: null }
    });
  }

  private async persist(session: WorkoutSession) {
    await this.sessions.save(session);
    return session;
  }
}
