import type { Equipment, MvpEquipment } from './workout';

export const videoContentKinds = ['follow_along', 'mobility', 'tutorial', 'plan', 'talk', 'other'] as const;
export type VideoContentKind = (typeof videoContentKinds)[number];

export type VideoWorkout = {
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DailyVideoWorkoutAssignment = {
  localDate: string;
  equipment: MvpEquipment;
  workoutVideoId: string;
  selectedAt: string;
};

export type DailyVideoWorkoutPair = Record<MvpEquipment, VideoWorkout | null>;

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function defaultDailyVideoEquipment(date: Date): MvpEquipment {
  const localDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
  return localDay % 2 === 0 ? 'bodyweight' : 'kettlebell';
}
