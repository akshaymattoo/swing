import {
  defaultDailyVideoEquipment,
  localDateKey,
  type DailyVideoWorkoutPair,
  type VideoWorkout
} from '../domain/videoWorkout';
import { isMvpEquipment, type MvpEquipment } from '../domain/workout';
import type { DailyVideoWorkoutRepository, VideoWorkoutRepository } from './ports';

export class VideoWorkoutOfDayService {
  constructor(
    private readonly videos: VideoWorkoutRepository,
    private readonly assignments: DailyVideoWorkoutRepository
  ) {}

  async getPairForDate(date = new Date()): Promise<DailyVideoWorkoutPair> {
    const [bodyweight, kettlebell] = await Promise.all([
      this.getForDate(date, 'bodyweight'),
      this.getForDate(date, 'kettlebell')
    ]);
    return { bodyweight, kettlebell };
  }

  async getForDate(date = new Date(), equipment: MvpEquipment = defaultDailyVideoEquipment(date)) {
    const dateKey = localDateKey(date);
    const existing = await this.assignments.getByDateAndEquipment(dateKey, equipment);
    if (existing) {
      const video = await this.videos.getById(existing.workoutVideoId);
      if (video?.isActive && video.wodEligible && video.equipment === equipment) return video;
    }

    const eligible = (await this.videos.listEligible())
      .filter((video) => isMvpEquipment(video.equipment) && video.equipment === equipment);
    if (eligible.length === 0) return null;

    const history = await this.assignments.listAll();
    const selections = new Map<string, { count: number; lastDate: string }>();
    for (const assignment of history) {
      const current = selections.get(assignment.workoutVideoId) ?? { count: 0, lastDate: '' };
      selections.set(assignment.workoutVideoId, {
        count: current.count + 1,
        lastDate: current.lastDate > assignment.localDate ? current.lastDate : assignment.localDate
      });
    }

    const selected = [...eligible].sort((left, right) => {
      const leftHistory = selections.get(left.id) ?? { count: 0, lastDate: '' };
      const rightHistory = selections.get(right.id) ?? { count: 0, lastDate: '' };
      return leftHistory.count - rightHistory.count
        || leftHistory.lastDate.localeCompare(rightHistory.lastDate)
        || this.dailyRank(dateKey, left).localeCompare(this.dailyRank(dateKey, right));
    })[0];

    await this.assignments.save({
      localDate: dateKey,
      equipment,
      workoutVideoId: selected.id,
      selectedAt: date.toISOString()
    });
    return selected;
  }

  private dailyRank(dateKey: string, video: VideoWorkout) {
    let hash = 2166136261;
    for (const character of `${dateKey}:${video.id}`) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return String(hash >>> 0).padStart(10, '0');
  }
}
