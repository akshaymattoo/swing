import type { WorkoutSession } from '../domain/session';
import type { WorkoutTemplate } from '../domain/workout';

export interface WorkoutRepository {
  listAll(): Promise<WorkoutTemplate[]>;
  listVault(): Promise<WorkoutTemplate[]>;
  listSaved(): Promise<WorkoutTemplate[]>;
  getById(id: string): Promise<WorkoutTemplate | null>;
  save(workout: WorkoutTemplate): Promise<void>;
  setSaved(id: string, saved: boolean): Promise<void>;
  deleteById(id: string): Promise<void>;
}

export interface SessionRepository {
  listRecent(limit?: number): Promise<WorkoutSession[]>;
  getActive(): Promise<WorkoutSession | null>;
  getById(id: string): Promise<WorkoutSession | null>;
  save(session: WorkoutSession): Promise<void>;
  deleteById(id: string): Promise<void>;
}

export type AppRepositories = {
  workouts: WorkoutRepository;
  sessions: SessionRepository;
};
