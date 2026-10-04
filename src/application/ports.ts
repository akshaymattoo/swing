import type { WorkoutSession } from '../domain/session';
import type { WorkoutTemplate } from '../domain/workout';
import type { DailyVideoWorkoutAssignment, VideoWorkout } from '../domain/videoWorkout';

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
  save(session: WorkoutSession): Promise<void>;
}

export interface VideoWorkoutRepository {
  listEligible(): Promise<VideoWorkout[]>;
  getById(id: string): Promise<VideoWorkout | null>;
  save(video: VideoWorkout): Promise<void>;
}

export interface DailyVideoWorkoutRepository {
  getByDate(localDate: string): Promise<DailyVideoWorkoutAssignment | null>;
  listAll(): Promise<DailyVideoWorkoutAssignment[]>;
  save(assignment: DailyVideoWorkoutAssignment): Promise<void>;
}

export type AppRepositories = {
  workouts: WorkoutRepository;
  sessions: SessionRepository;
  videoWorkouts: VideoWorkoutRepository;
  dailyVideoWorkouts: DailyVideoWorkoutRepository;
};
