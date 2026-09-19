import { SessionService } from './sessionService';
import type { AppRepositories } from './ports';
import { WorkoutService } from './workoutService';

export type AppContainer = ReturnType<typeof createAppContainer>;

export function createAppContainer(repositories: AppRepositories) {
  return {
    workouts: new WorkoutService(repositories.workouts),
    sessions: new SessionService(repositories.sessions, repositories.workouts)
  };
}
