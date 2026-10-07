import fs from 'node:fs/promises';
import path from 'node:path';

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? 'src/infrastructure/database/videoWorkoutCatalog.json';
const approvedIds = new Set(JSON.parse(await fs.readFile(new URL('./approved-video-workout-ids.json', import.meta.url), 'utf8')));

if (!inputPath) {
  throw new Error('Usage: node scripts/build-video-catalog.mjs <workout_catalog.csv> [output.json]');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value.replace(/\r$/, ''));
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records
    .filter((record) => record.some(Boolean))
    .map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])));
}

function durationSeconds(value) {
  const duration = value.trim().toLowerCase();
  let match = duration.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    return match[3]
      ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
      : Number(match[1]) * 60 + Number(match[2]);
  }
  match = duration.match(/^(\d+)\s*(?:min|mins|minute|minutes)$/);
  if (match) return Number(match[1]) * 60;
  match = duration.match(/^(\d+)\s*hours?,\s*(\d+)\s*minutes?$/);
  if (match) return Number(match[1]) * 3600 + Number(match[2]) * 60;
  match = duration.match(/^(\d+)\s*minutes?,\s*(\d+)\s*seconds?$/);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  throw new Error(`Unsupported duration: ${value}`);
}

function equipment(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'dumbbell') return 'dumbbells';
  if (normalized === 'resistance band') return 'bands';
  if (['bodyweight', 'kettlebell'].includes(normalized)) return normalized;
  throw new Error(`Unsupported equipment: ${value}`);
}

function contentKind(record) {
  const content = `${record.title} ${record.focus}`.toLowerCase();
  if (/nutrition|what i eat|fasting|rules to|motivational|meal|podcast|carnivore/.test(content)) return 'talk';
  if (/workout plan|challenge january|challenge announcement/.test(content)) return 'plan';
  if (/\bhow to\b|tutorial|guide|fixed my|first pull.?up/.test(content)) return 'tutorial';
  if (/mobility|stretch|yoga|warm.?up/.test(content)) return 'mobility';
  if (/workout|routine|live with me|emom|amrap|tabata|hiit|circuit/.test(content)) return 'follow_along';
  return 'other';
}

function youtubeVideoId(url) {
  const parsed = new URL(url);
  const id = parsed.searchParams.get('v') ?? parsed.pathname.split('/').filter(Boolean).at(-1);
  if (!id) throw new Error(`Unable to read YouTube video ID: ${url}`);
  return id;
}

const source = await fs.readFile(inputPath, 'utf8');
const records = parseCsv(source.replace(/^\uFEFF/, ''));
const seen = new Set();
const videos = records
  .filter((record) => record.type.trim().toLowerCase() === 'video')
  .map((record) => {
    const youtubeId = youtubeVideoId(record.link);
    const kind = contentKind(record);
    const seconds = durationSeconds(record.duration);
    return {
      id: `youtube-${youtubeId}`,
      youtubeVideoId: youtubeId,
      title: record.title.trim(),
      channelName: record.channel.trim(),
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      durationSeconds: seconds,
      equipment: equipment(record.equipment),
      focus: record.focus.trim(),
      publishedText: record.published.trim(),
      contentKind: kind,
      wodEligible: approvedIds.has(youtubeId)
    };
  })
  .filter((video) => {
    if (seen.has(video.youtubeVideoId)) return false;
    seen.add(video.youtubeVideoId);
    return true;
  });

const catalogIds = new Set(videos.map((video) => video.youtubeVideoId));
const missingApprovals = [...approvedIds].filter((id) => !catalogIds.has(id));
if (missingApprovals.length) {
  throw new Error(`Approved videos missing from the source catalog: ${missingApprovals.join(', ')}`);
}

const invalidDurations = videos.filter(
  (video) => video.wodEligible && (video.durationSeconds < 20 * 60 || video.durationSeconds > 35 * 60)
);
if (invalidDurations.length) {
  throw new Error(`Approved videos outside the 20–35 minute window: ${invalidDurations.map((video) => video.youtubeVideoId).join(', ')}`);
}

const invalidEquipment = videos.filter(
  (video) => video.wodEligible && !['bodyweight', 'kettlebell'].includes(video.equipment)
);
if (invalidEquipment.length) {
  throw new Error(`Approved videos outside the MVP equipment set: ${invalidEquipment.map((video) => video.youtubeVideoId).join(', ')}`);
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(videos, null, 2)}\n`);

const eligible = videos.filter((video) => video.wodEligible);
console.log(`Wrote ${videos.length} full-length videos (${eligible.length} eligible for Workout of the Day) to ${outputPath}`);
