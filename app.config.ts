import type { ExpoConfig } from 'expo/config';

import palette from './src/theme/palette.json';

const config: ExpoConfig = {
  name: 'Swing',
  slug: 'swing',
  owner: 'akshaymattoo',
  version: '1.0.0',
  icon: './assets/brand/app-icon.png',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.akshaymattoo.swing',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    package: 'com.akshaymattoo.swing',
    adaptiveIcon: {
      foregroundImage: './assets/brand/adaptive-icon.png',
      backgroundColor: palette.background
    }
  },
  extra: {
    eas: {
      projectId: '7e7fb441-2538-40f1-a6c0-b9c4d53045a7'
    }
  },
  plugins: [
    'expo-sqlite',
    'expo-localization',
    'expo-asset',
    [
      'expo-splash-screen',
      {
        image: './assets/brand/splash-icon.png',
        imageWidth: 210,
        resizeMode: 'contain',
        backgroundColor: palette.background,
        dark: {
          image: './assets/brand/splash-icon.png',
          backgroundColor: palette.background
        }
      }
    ]
  ]
};

export default config;
