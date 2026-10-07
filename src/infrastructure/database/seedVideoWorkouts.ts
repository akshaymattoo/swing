import type { VideoContentKind, VideoWorkout } from '../../domain/videoWorkout';
import type { Equipment } from '../../domain/workout';
import type { VideoWorkoutRepository } from '../../application/ports';
import type { DatabaseClient } from './DatabaseClient';
import catalog from './videoWorkoutCatalog.json';

type CatalogVideo = {
  id: string;
  youtubeVideoId: string;
  title: string;
  channelName: string;
  youtubeUrl: string;
  durationSeconds: number;
  equipment: Equipment;
  focus: string;
  publishedText: string;
  contentKind: VideoContentKind;
  viewCount: number;
  wodEligible: boolean;
};

export async function seedVideoWorkouts(database: DatabaseClient, repository: VideoWorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-10-07T03:10:18.213Z';
  const metadataKey = 'video_workout_catalog_version';
  const existingVersion = await database.first<{ value: string }>('SELECT value FROM app_metadata WHERE key = ?', [metadataKey]);
  if (existingVersion?.value === contentVersion) return;

  await database.transaction(async () => {
    await database.run('UPDATE workout_videos SET wod_eligible = 0, is_active = 0');
    for (const item of catalog as CatalogVideo[]) {
      const { viewCount: _viewCount, ...catalogVideo } = item;
      const video: VideoWorkout = {
        ...catalogVideo,
        isActive: true,
        createdAt,
        updatedAt: contentVersion
      };
      await repository.save(video);
    }
    await database.run(
      `INSERT INTO app_metadata (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [metadataKey, contentVersion]
    );
  });
}
