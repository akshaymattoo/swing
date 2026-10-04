import type { DailyVideoWorkoutRepository, SessionRepository, VideoWorkoutRepository, WorkoutRepository } from '../../application/ports';
import type { WorkoutSession } from '../../domain/session';
import type { DailyVideoWorkoutAssignment, VideoWorkout } from '../../domain/videoWorkout';
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

  async deleteById(id: string) {
    const index = this.records.findIndex((workout) => workout.id === id);
    if (index >= 0) this.records.splice(index, 1);
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

  async save(session: WorkoutSession) {
    const index = this.records.findIndex((record) => record.id === session.id);
    if (index >= 0) this.records[index] = session;
    else this.records.push(session);
  }

}

export class MemoryVideoWorkoutRepository implements VideoWorkoutRepository {
  constructor(private readonly records: VideoWorkout[] = []) {}

  async listEligible() {
    return this.records.filter((video) => video.isActive && video.wodEligible);
  }

  async getById(id: string) {
    return this.records.find((video) => video.id === id) ?? null;
  }

  async save(video: VideoWorkout) {
    const index = this.records.findIndex((record) => record.id === video.id);
    if (index >= 0) this.records[index] = video;
    else this.records.push(video);
  }
}

export class MemoryDailyVideoWorkoutRepository implements DailyVideoWorkoutRepository {
  constructor(private readonly records: DailyVideoWorkoutAssignment[] = []) {}

  async getByDate(localDate: string) {
    return this.records.find((assignment) => assignment.localDate === localDate) ?? null;
  }

  async listAll() {
    return [...this.records];
  }

  async save(assignment: DailyVideoWorkoutAssignment) {
    const index = this.records.findIndex((record) => record.localDate === assignment.localDate);
    if (index >= 0) this.records[index] = assignment;
    else this.records.push(assignment);
  }
}
