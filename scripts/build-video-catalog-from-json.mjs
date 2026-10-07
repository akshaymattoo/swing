import fs from 'node:fs/promises';
import path from 'node:path';

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? 'src/infrastructure/database/videoWorkoutCatalog.json';
const approvedPath = new URL('./approved-video-workout-ids.json', import.meta.url);

if (!inputPath) {
  throw new Error('Usage: node scripts/build-video-catalog-from-json.mjs <workouts_flat.json> [output.json]');
}

const source = JSON.parse(await fs.readFile(inputPath, 'utf8'));
if (!Array.isArray(source.videos)) throw new Error('Expected a videos array in workouts_flat.json');

const excludedContent = /mobility|stretch|warm.?up|cool.?down|tutorial|how to|mistake|review|podcast|workout plan|habits/i;
const bodyPartOnly = /\b(ab|abs|arms?|shoulders?|legs?|glutes?|booty|core|upper body|lower body|back|chest|biceps|triceps|calves|thighs)\b/i;

function equipmentFor(video) {
  const equipment = (video.equipment ?? []).map((item) => String(item).toLowerCase());
  const title = video.title.toLowerCase();
  if (equipment.includes('kettlebell') || /kettlebell|\bkb\b/.test(title)) return 'kettlebell';
  const bodyweightTitle = /no equipment|bodyweight|no weights|calisthenics/.test(title);
  const hasOtherEquipment = equipment.some((item) => !['bodyweight', 'none'].includes(item));
  if ((equipment.includes('bodyweight') || bodyweightTitle) && !hasOtherEquipment) return 'bodyweight';
  return null;
}

function isBroadWorkout(video) {
  return /full body|total body/i.test(video.title) || !bodyPartOnly.test(video.title);
}

function isCandidate(video) {
  return video.is_long_form === true
    && video.is_live !== true
    && video.content_type === 'workout'
    && video.duration_seconds >= 10 * 60
    && video.duration_seconds < 40 * 60
    && equipmentFor(video) !== null
    && !excludedContent.test(video.title)
    && isBroadWorkout(video)
    && !/double kettlebell/i.test(video.title);
}

const candidates = source.videos.filter(isCandidate);
const selected = ['kettlebell', 'bodyweight'].flatMap((equipment) => candidates
  .filter((video) => equipmentFor(video) === equipment)
  .sort((left, right) => (right.view_count ?? 0) - (left.view_count ?? 0)
    || left.video_id.localeCompare(right.video_id))
  .slice(0, 30));

if (selected.length !== 60) throw new Error(`Expected 60 selected videos, found ${selected.length}`);
const approvedIds = new Set(selected.map((video) => video.video_id));

const videos = candidates.map((video) => ({
  id: `youtube-${video.video_id}`,
  youtubeVideoId: video.video_id,
  title: video.title.trim(),
  channelName: video.channel?.name?.trim() || video.channel?.handle?.trim() || 'YouTube coach',
  youtubeUrl: video.url || `https://www.youtube.com/watch?v=${video.video_id}`,
  durationSeconds: video.duration_seconds,
  equipment: equipmentFor(video),
  focus: [...new Set([
    ...(video.workout_types ?? []),
    ...(video.target_body_parts ?? []),
    ...(video.difficulty_levels ?? [])
  ])].join(', ') || 'full body',
  publishedText: video.published_at ?? '',
  contentKind: 'follow_along',
  viewCount: video.view_count ?? 0,
  wodEligible: approvedIds.has(video.video_id)
}));

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(videos, null, 2)}\n`);
await fs.writeFile(approvedPath, `${JSON.stringify(selected.map((video) => video.video_id), null, 2)}\n`);

const counts = Object.fromEntries(['kettlebell', 'bodyweight'].map((equipment) => [
  equipment,
  selected.filter((video) => equipmentFor(video) === equipment).length
]));
console.log(`Wrote ${videos.length} eligible source videos and selected ${selected.length} Workout-of-the-Day videos (${counts.kettlebell} kettlebell, ${counts.bodyweight} bodyweight)`);
