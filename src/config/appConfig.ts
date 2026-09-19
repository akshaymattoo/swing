import type { AppRepositories } from '../application/ports';
import { ExpoSQLiteClient } from '../infrastructure/database/ExpoSQLiteClient';
import { migrateDatabase } from '../infrastructure/database/migrations';
import { seedVault } from '../infrastructure/database/seedWorkouts';
import { SqlSessionRepository } from '../infrastructure/repositories/SqlSessionRepository';
import { SqlWorkoutRepository } from '../infrastructure/repositories/SqlWorkoutRepository';

export type PersistenceConfig = {
  createRepositories(): Promise<AppRepositories>;
};

export type SwingAppConfig = {
  persistence: PersistenceConfig;
};

export function sqlitePersistence(databaseName: string): PersistenceConfig {
  return {
    async createRepositories() {
      const database = await ExpoSQLiteClient.open(databaseName);
      await migrateDatabase(database);
      const workouts = new SqlWorkoutRepository(database);
      const sessions = new SqlSessionRepository(database);
      await seedVault(workouts);
      return { workouts, sessions };
    }
  };
}

// Future Supabase switch:
// replace persistence with an adapter that returns the same two repository interfaces.
export const appConfig: SwingAppConfig = {
  persistence: sqlitePersistence('swing.db')
};
