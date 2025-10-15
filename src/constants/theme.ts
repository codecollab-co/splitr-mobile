import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#34C759',
    tertiary: '#FF9500',
    error: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    onSurface: '#000000',
    onSurfaceVariant: '#6D6D80',
    outline: '#C7C7CC',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#1C1C1E',
    inverseOnSurface: '#F2F2F7',
    inversePrimary: '#0A84FF',
    // Custom colors
    accent: '#5856D6',
    cardBackground: '#FFFFFF',
    headerBackground: '#F2F2F7',
    tabBarBackground: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#6D6D80',
    textTertiary: '#C7C7CC',
    divider: '#E5E5EA',
    placeholder: '#C7C7CC',
    positive: '#34C759',
    negative: '#FF3B30',
    neutral: '#8E8E93',
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A84FF',
    secondary: '#32D74B',
    tertiary: '#FF9F0A',
    error: '#FF453A',
    warning: '#FF9F0A',
    success: '#32D74B',
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#8E8E93',
    outline: '#48484A',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#F2F2F7',
    inverseOnSurface: '#1C1C1E',
    inversePrimary: '#007AFF',
    // Custom colors
    accent: '#5E5CE6',
    cardBackground: '#1C1C1E',
    headerBackground: '#000000',
    tabBarBackground: '#1C1C1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
    divider: '#38383A',
    placeholder: '#48484A',
    positive: '#32D74B',
    negative: '#FF453A',
    neutral: '#8E8E93',
  },
  roundness: 12,
};

// Default to light theme
export const theme = lightTheme;

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 24,
  round: 50,
};

export const elevation = {
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 8,
  level5: 12,
};

export type Theme = typeof lightTheme;
export type Typography = typeof typography;
export type Spacing = typeof spacing;