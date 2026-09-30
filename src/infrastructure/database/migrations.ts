import type { DatabaseClient } from './DatabaseClient';

const DATABASE_VERSION = 3;

export async function migrateDatabase(database: DatabaseClient) {
  const version = await database.first<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = version?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  await database.transaction(async (transaction) => {
    if (currentVersion < 1) {
      await transaction.exec(`
        CREATE TABLE IF NOT EXISTS workout_templates (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          emoji TEXT,
          equipment TEXT NOT NULL,
          intensity TEXT NOT NULL,
          rounds INTEGER NOT NULL,
          startup_seconds INTEGER NOT NULL DEFAULT 20,
          work_seconds INTEGER NOT NULL,
          rest_seconds INTEGER NOT NULL,
          is_vault INTEGER NOT NULL DEFAULT 0,
          is_saved INTEGER NOT NULL DEFAULT 0,
          source_template_id TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (source_template_id) REFERENCES workout_templates(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS workout_exercises (
          id TEXT PRIMARY KEY NOT NULL,
          workout_template_id TEXT NOT NULL,
          name TEXT NOT NULL,
          position INTEGER NOT NULL,
          FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS workout_sessions (
          id TEXT PRIMARY KEY NOT NULL,
          workout_template_id TEXT,
          workout_snapshot TEXT NOT NULL,
          status TEXT NOT NULL,
          timer_state TEXT NOT NULL,
          started_at TEXT NOT NULL,
          ended_at TEXT,
          FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE SET NULL
        );

        CREATE INDEX IF NOT EXISTS idx_exercises_template_position
          ON workout_exercises(workout_template_id, position);
        CREATE INDEX IF NOT EXISTS idx_templates_vault
          ON workout_templates(is_vault);
        CREATE INDEX IF NOT EXISTS idx_templates_saved
          ON workout_templates(is_saved);
        CREATE INDEX IF NOT EXISTS idx_sessions_started
          ON workout_sessions(started_at DESC);
        CREATE INDEX IF NOT EXISTS idx_sessions_status
          ON workout_sessions(status);
      `);
    }
    if (currentVersion === 1) {
      await transaction.exec('ALTER TABLE workout_templates ADD COLUMN startup_seconds INTEGER NOT NULL DEFAULT 20;');
    }
    if (currentVersion < 3) {
      await transaction.exec(`
        CREATE TABLE IF NOT EXISTS workout_videos (
          id TEXT PRIMARY KEY NOT NULL,
          youtube_video_id TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          channel_name TEXT NOT NULL,
          youtube_url TEXT NOT NULL,
          duration_seconds INTEGER NOT NULL,
          equipment TEXT NOT NULL,
          focus TEXT NOT NULL,
          published_text TEXT NOT NULL,
          content_kind TEXT NOT NULL,
          wod_eligible INTEGER NOT NULL DEFAULT 0,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS daily_workout_assignments (
          local_date TEXT PRIMARY KEY NOT NULL,
          workout_video_id TEXT NOT NULL,
          selected_at TEXT NOT NULL,
          FOREIGN KEY (workout_video_id) REFERENCES workout_videos(id) ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS app_metadata (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_workout_videos_eligible
          ON workout_videos(wod_eligible, is_active, equipment);
        CREATE INDEX IF NOT EXISTS idx_daily_workout_video
          ON daily_workout_assignments(workout_video_id, local_date DESC);
      `);
    }
    await transaction.exec(`PRAGMA user_version = ${DATABASE_VERSION};`);
  });
}
