declare module 'expo-audio' {
  export function useAudioPlayer(source: string): {
    play(): void;
    seekTo(seconds: number): Promise<void>;
  };

  export function setAudioModeAsync(mode: { playsInSilentMode?: boolean }): Promise<void>;
}
