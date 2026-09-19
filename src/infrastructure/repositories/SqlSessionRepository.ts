import type { SessionRepository } from '../../application/ports';
import type { TimerState, WorkoutSession, WorkoutSnapshot, SessionStatus } from '../../domain/session';
import type { DatabaseClient } from '../database/DatabaseClient';

type SessionRow = {
  id: string;
  workout_template_id: string | null;
  workout_snapshot: string;
  status: SessionStatus;
  timer_state: string;
  started_at: string;
  ended_at: string | null;
};

export class SqlSessionRepository implements SessionRepository {
  constructor(private readonly database: DatabaseClient) {}

  async listRecent(limit = 50) {
    const rows = await this.database.all<SessionRow>(
      'SELECT * FROM workout_sessions ORDER BY started_at DESC LIMIT ?',
      [limit]
    );
    return rows.map((row) => this.map(row));
  }

  async getActive() {
    const row = await this.database.first<SessionRow>(
      "SELECT * FROM workout_sessions WHERE status = 'active' ORDER BY started_at DESC LIMIT 1"
    );
    return row ? this.map(row) : null;
  }

  async getById(id: string) {
    const row = await this.database.first<SessionRow>('SELECT * FROM workout_sessions WHERE id = ?', [id]);
    return row ? this.map(row) : null;
  }

  async save(session: WorkoutSession) {
    await this.database.run(
      `INSERT INTO workout_sessions (
        id, workout_template_id, workout_snapshot, status, timer_state, started_at, ended_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        workout_template_id = excluded.workout_template_id,
        workout_snapshot = excluded.workout_snapshot,
        status = excluded.status,
        timer_state = excluded.timer_state,
        ended_at = excluded.ended_at`,
      [
        session.id,
        session.workoutTemplateId,
        JSON.stringify(session.workoutSnapshot),
        session.status,
        JSON.stringify(session.timerState),
        session.startedAt,
        session.endedAt
      ]
    );
  }

  private map(row: SessionRow): WorkoutSession {
    return {
      id: row.id,
      workoutTemplateId: row.workout_template_id,
      workoutSnapshot: JSON.parse(row.workout_snapshot) as WorkoutSnapshot,
      status: row.status,
      timerState: JSON.parse(row.timer_state) as TimerState,
      startedAt: row.started_at,
      endedAt: row.ended_at
    };
  }
}
