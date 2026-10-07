import { createId } from '../domain/id';
import type { WorkoutDraft, WorkoutTemplate } from '../domain/workout';
import { isMvpEquipment, workoutDurationSeconds } from '../domain/workout';
import type { WorkoutRepository } from './ports';

export class WorkoutService {
  constructor(private readonly workouts: WorkoutRepository) {}

  async listVault() {
    const workouts = await this.workouts.listVault();
    return workouts.filter((workout) => isMvpEquipment(workout.equipment));
  }

  listSaved() {
    return this.workouts.listSaved();
  }

  getWorkout(id: string) {
    return this.workouts.getById(id);
  }

  calculateDuration(draft: Pick<WorkoutDraft, 'rounds' | 'startupSeconds' | 'workSeconds' | 'restSeconds' | 'exercises'>) {
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
      startupSeconds: draft.startupSeconds,
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

  async updateWorkout(id: string, draft: WorkoutDraft) {
    this.validateDraft(draft);
    const existing = await this.workouts.getById(id);
    if (!existing) throw new Error('Workout not found');
    if (existing.isVault) throw new Error('Vault workouts cannot be changed directly. Edit a copy instead.');

    const workout: WorkoutTemplate = {
      ...existing,
      name: draft.name.trim(),
      emoji: draft.emoji?.trim() || null,
      equipment: draft.equipment,
      intensity: draft.intensity,
      rounds: draft.rounds,
      startupSeconds: draft.startupSeconds,
      workSeconds: draft.workSeconds,
      restSeconds: draft.restSeconds,
      exercises: draft.exercises.map((name, position) => ({
        id: createId('exercise'),
        name: name.trim(),
        position
      })),
      updatedAt: new Date().toISOString()
    };
    await this.workouts.save(workout);
    return workout;
  }

  async deleteSavedWorkout(id: string) {
    const workout = await this.workouts.getById(id);
    if (!workout) return;
    if (workout.isVault) throw new Error('Vault workouts are always available and cannot be deleted');
    await this.workouts.deleteById(id);
  }

  private validateDraft(draft: WorkoutDraft) {
    if (!draft.name.trim()) throw new Error('Give your workout a name');
    if (draft.rounds < 1 || draft.rounds > 20) throw new Error('Rounds must be between 1 and 20');
    if (draft.startupSeconds < 0 || draft.startupSeconds > 300) throw new Error('Initial start time must be between 0 and 300 seconds');
    if (draft.workSeconds < 5 || draft.workSeconds > 600) throw new Error('Work time must be between 5 and 600 seconds');
    if (draft.restSeconds < 0 || draft.restSeconds > 300) throw new Error('Rest time must be between 0 and 300 seconds');
    if (draft.exercises.length === 0 || draft.exercises.some((name) => !name.trim())) {
      throw new Error('Add at least one movement');
    }
  }
}
