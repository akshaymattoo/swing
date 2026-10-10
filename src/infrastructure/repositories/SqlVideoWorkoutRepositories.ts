import type { DailyVideoWorkoutRepository, VideoWorkoutRepository } from '../../application/ports';
import type { DailyVideoWorkoutAssignment, VideoContentKind, VideoWorkout } from '../../domain/videoWorkout';
import type { Equipment } from '../../domain/workout';
import type { DatabaseClient } from '../database/DatabaseClient';

type VideoWorkoutRow = {
  id: string;
  youtube_video_id: string;
  title: string;
  channel_name: string;
  youtube_url: string;
  duration_seconds: number;
  equipment: Equipment;
  focus: string;
  published_text: string;
  content_kind: VideoContentKind;
  wod_eligible: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export class SqlVideoWorkoutRepository implements VideoWorkoutRepository {
  constructor(private readonly database: DatabaseClient) {}

  async listEligible() {
    const rows = await this.database.all<VideoWorkoutRow>(
      'SELECT * FROM workout_videos WHERE wod_eligible = 1 AND is_active = 1 ORDER BY id ASC'
    );
    return rows.map((row) => this.hydrate(row));
  }

  async getById(id: string) {
    const row = await this.database.first<VideoWorkoutRow>('SELECT * FROM workout_videos WHERE id = ?', [id]);
    return row ? this.hydrate(row) : null;
  }

  async save(video: VideoWorkout) {
    await this.database.run(
      `INSERT INTO workout_videos (
        id, youtube_video_id, title, channel_name, youtube_url, duration_seconds, equipment,
        focus, published_text, content_kind, wod_eligible, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        youtube_video_id = excluded.youtube_video_id,
        title = excluded.title,
        channel_name = excluded.channel_name,
        youtube_url = excluded.youtube_url,
        duration_seconds = excluded.duration_seconds,
        equipment = excluded.equipment,
        focus = excluded.focus,
        published_text = excluded.published_text,
        content_kind = excluded.content_kind,
        wod_eligible = excluded.wod_eligible,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at`,
      [
        video.id, video.youtubeVideoId, video.title, video.channelName, video.youtubeUrl,
        video.durationSeconds, video.equipment, video.focus, video.publishedText, video.contentKind,
        video.wodEligible ? 1 : 0, video.isActive ? 1 : 0, video.createdAt, video.updatedAt
      ]
    );
  }

  private hydrate(row: VideoWorkoutRow): VideoWorkout {
    return {
      id: row.id,
      youtubeVideoId: row.youtube_video_id,
      title: row.title,
      channelName: row.channel_name,
      youtubeUrl: row.youtube_url,
      durationSeconds: row.duration_seconds,
      equipment: row.equipment,
      focus: row.focus,
      publishedText: row.published_text,
      contentKind: row.content_kind,
      wodEligible: row.wod_eligible === 1,
      isActive: row.is_active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export class SqlDailyVideoWorkoutRepository implements DailyVideoWorkoutRepository {
  constructor(private readonly database: DatabaseClient) {}

  getByDateAndEquipment(localDate: string, equipment: DailyVideoWorkoutAssignment['equipment']) {
    return this.database.first<DailyVideoWorkoutAssignment>(
      `SELECT local_date AS localDate, equipment, workout_video_id AS workoutVideoId, selected_at AS selectedAt
       FROM daily_workout_assignments WHERE local_date = ? AND equipment = ?`,
      [localDate, equipment]
    );
  }

  listAll() {
    return this.database.all<DailyVideoWorkoutAssignment>(
      `SELECT local_date AS localDate, equipment, workout_video_id AS workoutVideoId, selected_at AS selectedAt
       FROM daily_workout_assignments ORDER BY local_date ASC, equipment ASC`
    );
  }

  save(assignment: DailyVideoWorkoutAssignment) {
    return this.database.run(
      `INSERT INTO daily_workout_assignments (local_date, equipment, workout_video_id, selected_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(local_date, equipment) DO UPDATE SET
         workout_video_id = excluded.workout_video_id,
         selected_at = excluded.selected_at`,
      [assignment.localDate, assignment.equipment, assignment.workoutVideoId, assignment.selectedAt]
    );
  }
}
