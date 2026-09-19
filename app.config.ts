import type { ExpoConfig } from 'expo/config';

import { colors } from './src/theme/colors';

const config: ExpoConfig = {
  name: 'Swing',
  slug: 'swing',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.akshaymattoo.swing'
  },
  android: {
    package: 'com.akshaymattoo.swing',
    adaptiveIcon: {
      backgroundColor: colors.text
    }
  },
  plugins: ['expo-sqlite']
};

export default config;
