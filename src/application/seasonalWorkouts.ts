import type { MvpEquipment } from '../domain/workout';

export type SeasonalWorkoutPlan = {
  occasion: 'halloween' | 'thanksgiving';
  videoIds: Record<MvpEquipment, string>;
  vaultWorkoutId: string;
};

const halloweenPlan: SeasonalWorkoutPlan = {
  occasion: 'halloween',
  videoIds: {
    bodyweight: 'youtube-9ld28ugcdpI',
    kettlebell: 'youtube-czzL1VtVV4A'
  },
  vaultWorkoutId: 'vault-kettlebell-3'
};

const thanksgivingPlan: SeasonalWorkoutPlan = {
  occasion: 'thanksgiving',
  videoIds: {
    bodyweight: 'youtube-cbKkB3POqaY',
    kettlebell: 'youtube-Ubj-a2DcyJw'
  },
  vaultWorkoutId: 'vault-bodyweight-23'
};

export function seasonalWorkoutPlanForDate(date: Date): SeasonalWorkoutPlan | null {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 9 && day === 31) return halloweenPlan;
  if (month === 10 && date.getDay() === 4 && day >= 22 && day <= 28) return thanksgivingPlan;
  return null;
}
