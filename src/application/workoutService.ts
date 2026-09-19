import { createId } from '../domain/id';
import type { WorkoutDraft, WorkoutTemplate } from '../domain/workout';
import { workoutDurationSeconds } from '../domain/workout';
import type { WorkoutRepository } from './ports';

export class WorkoutService {
  constructor(private readonly workouts: WorkoutRepository) {}

  listVault() {
    return this.workouts.listVault();
  }

  listSaved() {
    return this.workouts.listSaved();
  }

  getWorkout(id: string) {
    return this.workouts.getById(id);
  }

  calculateDuration(draft: Pick<WorkoutDraft, 'rounds' | 'workSeconds' | 'restSeconds' | 'exercises'>) {
    return workoutDurationSeconds({
      ...draft,
      exercises: draft.exercises.map((name, position) => ({ id: `${position}`, name, position }))
    });
  }

  async createWorkout(draft: WorkoutDraft) {
    this.validateDraft(draft);
    const now = new Date().toISOString();
    const workout: WorkoutTemplate = {
      id: createId('workout'),
      name: draft.name.trim(),
      emoji: draft.emoji?.trim() || null,
      equipment: draft.equipment,
      intensity: draft.intensity,
      rounds: draft.rounds,
      workSeconds: draft.workSeconds,
      restSeconds: draft.restSeconds,
      exercises: draft.exercises.map((name, position) => ({
        id: createId('exercise'),
        name: name.trim(),
        position
      })),
      isVault: false,
      isSaved: true,
      sourceTemplateId: draft.sourceTemplateId ?? null,
      createdAt: now,
      updatedAt: now
    };
    await this.workouts.save(workout);
    return workout;
  }

  async copyToSaved(id: string) {
    const source = await this.workouts.getById(id);
    if (!source) throw new Error('Workout not found');
    if (source.isSaved) return source;
    await this.workouts.setSaved(id, true);
    return { ...source, isSaved: true };
  }

  private validateDraft(draft: WorkoutDraft) {
    if (!draft.name.trim()) throw new Error('Give your workout a name');
    if (draft.rounds < 1 || draft.rounds > 20) throw new Error('Rounds must be between 1 and 20');
    if (draft.workSeconds < 5 || draft.workSeconds > 600) throw new Error('Work time must be between 5 and 600 seconds');
    if (draft.restSeconds < 0 || draft.restSeconds > 300) throw new Error('Rest time must be between 0 and 300 seconds');
    if (draft.exercises.length === 0 || draft.exercises.some((name) => !name.trim())) {
      throw new Error('Add at least one movement');
    }
  }
}
