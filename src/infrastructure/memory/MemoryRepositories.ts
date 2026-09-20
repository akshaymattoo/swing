import type { SessionRepository, WorkoutRepository } from '../../application/ports';
import type { WorkoutSession } from '../../domain/session';
import type { WorkoutTemplate } from '../../domain/workout';

export class MemoryWorkoutRepository implements WorkoutRepository {
  constructor(private readonly records: WorkoutTemplate[] = []) {}

  async listAll() {
    return [...this.records];
  }

  async listVault() {
    return this.records.filter((workout) => workout.isVault);
  }

  async listSaved() {
    return this.records.filter((workout) => workout.isSaved);
  }

  async getById(id: string) {
    return this.records.find((workout) => workout.id === id) ?? null;
  }

  async save(workout: WorkoutTemplate) {
    const index = this.records.findIndex((record) => record.id === workout.id);
    if (index >= 0) this.records[index] = workout;
    else this.records.push(workout);
  }

  async setSaved(id: string, saved: boolean) {
    const workout = this.records.find((record) => record.id === id);
    if (workout) workout.isSaved = saved;
  }
}

export class MemorySessionRepository implements SessionRepository {
  constructor(private readonly records: WorkoutSession[] = []) {}

  async listRecent(limit = 50) {
    return [...this.records]
      .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
      .slice(0, limit);
  }

  async getActive() {
    return this.records.find((session) => session.status === 'active') ?? null;
  }

  async getById(id: string) {
    return this.records.find((session) => session.id === id) ?? null;
  }

  async save(session: WorkoutSession) {
    const index = this.records.findIndex((record) => record.id === session.id);
    if (index >= 0) this.records[index] = session;
    else this.records.push(session);
  }

  async deleteById(id: string) {
    const index = this.records.findIndex((session) => session.id === id);
    if (index >= 0) this.records.splice(index, 1);
  }
}
