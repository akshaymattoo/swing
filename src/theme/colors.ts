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

export const tealOrangeColors: SwingColors = {
  background: '#F3FBF9',
  surface: '#FFFFFF',
  surfaceRaised: '#DCEFEB',
  featuredMuted: '#D6E7E4',
  primary: '#F3703C',
  primaryPressed: '#D95729',
  onPrimary: '#FFFFFF',
  text: '#16312F',
  textMuted: '#5E7773',
  border: '#C6DEDA',
  work: '#087D74',
  rest: '#2F6FBA',
  paused: '#B56B08',
  success: '#188A59',
  successSurface: '#DDF3E8',
  danger: '#C3403D',
  dangerSurface: '#F9E4E2'
};

// Change this one export to switch the entire app palette later.
export const colors = tealOrangeColors;
