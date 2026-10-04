import type { ImageSourcePropType } from 'react-native';

import type { Equipment } from '../domain/workout';

export const equipmentArtwork: Record<Equipment, ImageSourcePropType> = {
  kettlebell: require('../../assets/equipment/kettlebell.png'),
  dumbbells: require('../../assets/equipment/dumbbells.png'),
  bands: require('../../assets/equipment/bands.png'),
  bodyweight: require('../../assets/equipment/bodyweight.png')
};
