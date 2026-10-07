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
  wodEligible: boolean;
};

export async function seedVideoWorkouts(database: DatabaseClient, repository: VideoWorkoutRepository) {
  const createdAt = new Date(0).toISOString();
  const contentVersion = '2026-10-06T00:00:00.000Z';
  const metadataKey = 'video_workout_catalog_version';
  const existingVersion = await database.first<{ value: string }>('SELECT value FROM app_metadata WHERE key = ?', [metadataKey]);
  if (existingVersion?.value === contentVersion) return;

  await database.transaction(async () => {
    for (const item of catalog as CatalogVideo[]) {
      const video: VideoWorkout = {
        ...item,
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
