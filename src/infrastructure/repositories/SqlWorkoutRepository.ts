import type { WorkoutRepository } from '../../application/ports';
import type { Equipment, Intensity, WorkoutExercise, WorkoutTemplate } from '../../domain/workout';
import type { DatabaseClient } from '../database/DatabaseClient';

type WorkoutRow = {
  id: string;
  name: string;
  emoji: string | null;
  equipment: Equipment;
  intensity: Intensity;
  rounds: number;
  startup_seconds: number;
  work_seconds: number;
  rest_seconds: number;
  is_vault: number;
  is_saved: number;
  source_template_id: string | null;
  created_at: string;
  updated_at: string;
};

type ExerciseRow = {
  id: string;
  name: string;
  position: number;
};

export class SqlWorkoutRepository implements WorkoutRepository {
  constructor(private readonly database: DatabaseClient) {}

  listAll() {
    return this.listWhere('1 = 1');
  }

  listVault() {
    return this.listWhere('is_vault = 1');
  }

  listSaved() {
    return this.listWhere('is_saved = 1');
  }

  async getById(id: string) {
    const row = await this.database.first<WorkoutRow>('SELECT * FROM workout_templates WHERE id = ?', [id]);
    return row ? this.hydrate(row) : null;
  }

  async save(workout: WorkoutTemplate) {
    await this.database.transaction(async (transaction) => {
      await transaction.run(
        `INSERT INTO workout_templates (
          id, name, emoji, equipment, intensity, rounds, startup_seconds, work_seconds, rest_seconds,
          is_vault, is_saved, source_template_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          emoji = excluded.emoji,
          equipment = excluded.equipment,
          intensity = excluded.intensity,
          rounds = excluded.rounds,
          startup_seconds = excluded.startup_seconds,
          work_seconds = excluded.work_seconds,
          rest_seconds = excluded.rest_seconds,
          is_vault = excluded.is_vault,
          is_saved = excluded.is_saved,
          source_template_id = excluded.source_template_id,
          updated_at = excluded.updated_at`,
        [
          workout.id, workout.name, workout.emoji, workout.equipment, workout.intensity,
          workout.rounds, workout.startupSeconds, workout.workSeconds, workout.restSeconds,
          workout.isVault ? 1 : 0, workout.isSaved ? 1 : 0,
          workout.sourceTemplateId, workout.createdAt, workout.updatedAt
        ]
      );
      await transaction.run('DELETE FROM workout_exercises WHERE workout_template_id = ?', [workout.id]);
      for (const exercise of workout.exercises) {
        await transaction.run(
          'INSERT INTO workout_exercises (id, workout_template_id, name, position) VALUES (?, ?, ?, ?)',
          [exercise.id, workout.id, exercise.name, exercise.position]
        );
      }
    });
  }

  async setSaved(id: string, saved: boolean) {
    await this.database.run(
      'UPDATE workout_templates SET is_saved = ?, updated_at = ? WHERE id = ?',
      [saved ? 1 : 0, new Date().toISOString(), id]
    );
  }

  private async listWhere(where: string) {
    const rows = await this.database.all<WorkoutRow>(
      `SELECT * FROM workout_templates WHERE ${where} ORDER BY is_vault DESC, updated_at DESC, name ASC`
    );
    return Promise.all(rows.map((row) => this.hydrate(row)));
  }

  private async hydrate(row: WorkoutRow): Promise<WorkoutTemplate> {
    const exercises = await this.database.all<ExerciseRow>(
      'SELECT id, name, position FROM workout_exercises WHERE workout_template_id = ? ORDER BY position ASC',
      [row.id]
    );
    return {
      id: row.id,
      name: row.name,
      emoji: row.emoji,
      equipment: row.equipment,
      intensity: row.intensity,
      rounds: row.rounds,
      startupSeconds: row.startup_seconds,
      workSeconds: row.work_seconds,
      restSeconds: row.rest_seconds,
      exercises: exercises as WorkoutExercise[],
      isVault: row.is_vault === 1,
      isSaved: row.is_saved === 1,
      sourceTemplateId: row.source_template_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
