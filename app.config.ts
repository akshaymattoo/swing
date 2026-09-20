import type { ExpoConfig } from 'expo/config';

import palette from './src/theme/palette.json';

const config: ExpoConfig = {
  name: 'Swing',
  slug: 'swing',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.akshaymattoo.swing'
  },
  android: {
    package: 'com.akshaymattoo.swing',
    adaptiveIcon: {
      backgroundColor: palette.text
    }
  },
  plugins: ['expo-sqlite']
};

export default config;
