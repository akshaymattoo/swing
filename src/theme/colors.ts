import palette from './palette.json';

export type SwingColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  featuredSurface: string;
  onFeatured: string;
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

export const orangeRedColors: SwingColors = {
  background: '#FFF8F2',
  surface: '#FFFFFF',
  surfaceRaised: '#F2E7DE',
  featuredSurface: '#27211E',
  onFeatured: '#FFF8F2',
  featuredMuted: '#D6CBC4',
  primary: '#EB5A34',
  primaryPressed: '#D94D29',
  onPrimary: '#FFFFFF',
  text: '#211D1A',
  textMuted: '#71655F',
  border: '#E2D6CC',
  work: '#D94D29',
  rest: '#2F6FBA',
  paused: '#B56B08',
  success: '#188A59',
  successSurface: '#DDF3E8',
  danger: '#C3403D',
  dangerSurface: '#F9E4E2'
};

export const electricLimeColors: SwingColors = {
  background: '#151914',
  surface: '#1B2119',
  surfaceRaised: '#22281F',
  featuredSurface: '#252D20',
  onFeatured: '#F6FAEF',
  featuredMuted: '#B7C0B0',
  primary: '#B8F34A',
  primaryPressed: '#9ED632',
  onPrimary: '#11150D',
  text: '#F6FAEF',
  textMuted: '#AEB8A7',
  border: '#35412F',
  work: '#B8F34A',
  rest: '#78A5FF',
  paused: '#FFD35A',
  success: '#73DCA6',
  successSurface: '#213B2D',
  danger: '#FF817B',
  dangerSurface: '#422523'
};

export const purpleCoralColors: SwingColors = {
  background: '#FAF5FF',
  surface: '#FFFFFF',
  surfaceRaised: '#F0E7F8',
  featuredSurface: '#EDE2FA',
  onFeatured: '#251B2C',
  featuredMuted: '#6E5D78',
  primary: '#FF684E',
  primaryPressed: '#E8543D',
  onPrimary: '#FFFFFF',
  text: '#251B2C',
  textMuted: '#75667D',
  border: '#DCCCEB',
  work: '#7147B8',
  rest: '#356FBD',
  paused: '#A86708',
  success: '#188A59',
  successSurface: '#DDF3E8',
  danger: '#C3403D',
  dangerSurface: '#F9E4E2'
};

export const cobaltYellowColors: SwingColors = {
  background: '#F5F8FF',
  surface: '#FFFFFF',
  surfaceRaised: '#E5ECFB',
  featuredSurface: '#173F92',
  onFeatured: '#FFFFFF',
  featuredMuted: '#D6E1FA',
  primary: '#FFD735',
  primaryPressed: '#E6BE1F',
  onPrimary: '#17203A',
  text: '#152044',
  textMuted: '#65708E',
  border: '#CBD9F3',
  work: '#1959D1',
  rest: '#1959D1',
  paused: '#A86708',
  success: '#188A59',
  successSurface: '#DDF3E8',
  danger: '#C3403D',
  dangerSurface: '#F9E4E2'
};

export const hotPinkNavyColors: SwingColors = {
  background: '#F8F7FD',
  surface: '#FFFFFF',
  surfaceRaised: '#E7EAFB',
  featuredSurface: '#172551',
  onFeatured: '#FFFFFF',
  featuredMuted: '#D9DDF2',
  primary: '#E72D83',
  primaryPressed: '#C91D6C',
  onPrimary: '#FFFFFF',
  text: '#151C35',
  textMuted: '#66708E',
  border: '#CFD5F0',
  work: '#DB2178',
  rest: '#416FC5',
  paused: '#A86708',
  success: '#188A59',
  successSurface: '#DDF3E8',
  danger: '#C3403D',
  dangerSurface: '#F9E4E2'
};

// Switch this one line to test any palette with Fast Refresh.
export const colors = tealOrangeColors;
