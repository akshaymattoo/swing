import palette from './palette.json';

export type SwingColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  featuredMuted: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  text: string;
  textMuted: string;
  border: string;
  work: string;
  rest: string;
  paused: string;
  success: string;
  successSurface: string;
  danger: string;
  dangerSurface: string;
};

export const tealOrangeColors: SwingColors = palette;

// Edit palette.json to switch the entire app palette later.
export const colors = tealOrangeColors;
