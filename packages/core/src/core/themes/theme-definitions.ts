/**
 * Theme definitions based on shadcn theming system
 * Supports CSS variables for customizable color palettes
 */

export interface ThemeColors {
  // Core colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Primary colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string;
  
  // Destructive colors
  destructive: string;
  destructiveForeground: string;
  
  // UI elements
  border: string;
  input: string;
  ring: string;
  
  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface Theme {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

// Default theme (Neutral)
export const neutralTheme: Theme = {
  name: 'neutral',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.145 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.145 0 0)',
    primary: 'oklch(0.205 0 0)',
    primaryForeground: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.97 0 0)',
    secondaryForeground: 'oklch(0.205 0 0)',
    muted: 'oklch(0.97 0 0)',
    mutedForeground: 'oklch(0.556 0 0)',
    accent: 'oklch(0.97 0 0)',
    accentForeground: 'oklch(0.205 0 0)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.985 0 0)',
    border: 'oklch(0.922 0 0)',
    input: 'oklch(0.922 0 0)',
    ring: 'oklch(0.708 0 0)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)'
  },
  dark: {
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.205 0 0)',
    cardForeground: 'oklch(0.985 0 0)',
    popover: 'oklch(0.269 0 0)',
    popoverForeground: 'oklch(0.985 0 0)',
    primary: 'oklch(0.922 0 0)',
    primaryForeground: 'oklch(0.205 0 0)',
    secondary: 'oklch(0.269 0 0)',
    secondaryForeground: 'oklch(0.985 0 0)',
    muted: 'oklch(0.269 0 0)',
    mutedForeground: 'oklch(0.708 0 0)',
    accent: 'oklch(0.371 0 0)',
    accentForeground: 'oklch(0.985 0 0)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.985 0 0)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.556 0 0)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)'
  }
};

// Stone theme
export const stoneTheme: Theme = {
  name: 'stone',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.147 0.004 49.25)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.147 0.004 49.25)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.147 0.004 49.25)',
    primary: 'oklch(0.216 0.006 56.043)',
    primaryForeground: 'oklch(0.985 0.001 106.423)',
    secondary: 'oklch(0.97 0.001 106.424)',
    secondaryForeground: 'oklch(0.216 0.006 56.043)',
    muted: 'oklch(0.97 0.001 106.424)',
    mutedForeground: 'oklch(0.553 0.013 58.071)',
    accent: 'oklch(0.97 0.001 106.424)',
    accentForeground: 'oklch(0.216 0.006 56.043)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.985 0.001 106.423)',
    border: 'oklch(0.923 0.003 48.717)',
    input: 'oklch(0.923 0.003 48.717)',
    ring: 'oklch(0.709 0.01 56.259)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)'
  },
  dark: {
    background: 'oklch(0.147 0.004 49.25)',
    foreground: 'oklch(0.985 0.001 106.423)',
    card: 'oklch(0.216 0.006 56.043)',
    cardForeground: 'oklch(0.985 0.001 106.423)',
    popover: 'oklch(0.216 0.006 56.043)',
    popoverForeground: 'oklch(0.985 0.001 106.423)',
    primary: 'oklch(0.923 0.003 48.717)',
    primaryForeground: 'oklch(0.216 0.006 56.043)',
    secondary: 'oklch(0.268 0.007 34.298)',
    secondaryForeground: 'oklch(0.985 0.001 106.423)',
    muted: 'oklch(0.268 0.007 34.298)',
    mutedForeground: 'oklch(0.709 0.01 56.259)',
    accent: 'oklch(0.268 0.007 34.298)',
    accentForeground: 'oklch(0.985 0.001 106.423)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.985 0.001 106.423)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.553 0.013 58.071)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)'
  }
};

// Zinc theme
export const zincTheme: Theme = {
  name: 'zinc',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.141 0.005 285.823)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.141 0.005 285.823)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.141 0.005 285.823)',
    primary: 'oklch(0.21 0.006 285.885)',
    primaryForeground: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.967 0.001 286.375)',
    secondaryForeground: 'oklch(0.21 0.006 285.885)',
    muted: 'oklch(0.967 0.001 286.375)',
    mutedForeground: 'oklch(0.552 0.016 285.938)',
    accent: 'oklch(0.967 0.001 286.375)',
    accentForeground: 'oklch(0.21 0.006 285.885)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.985 0 0)',
    border: 'oklch(0.92 0.004 286.32)',
    input: 'oklch(0.92 0.004 286.32)',
    ring: 'oklch(0.705 0.015 286.067)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)'
  },
  dark: {
    background: 'oklch(0.141 0.005 285.823)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.21 0.006 285.885)',
    cardForeground: 'oklch(0.985 0 0)',
    popover: 'oklch(0.21 0.006 285.885)',
    popoverForeground: 'oklch(0.985 0 0)',
    primary: 'oklch(0.92 0.004 286.32)',
    primaryForeground: 'oklch(0.21 0.006 285.885)',
    secondary: 'oklch(0.274 0.006 286.033)',
    secondaryForeground: 'oklch(0.985 0 0)',
    muted: 'oklch(0.274 0.006 286.033)',
    mutedForeground: 'oklch(0.705 0.015 286.067)',
    accent: 'oklch(0.274 0.006 286.033)',
    accentForeground: 'oklch(0.985 0 0)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.985 0 0)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.552 0.016 285.938)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)'
  }
};

// Gray theme
export const grayTheme: Theme = {
  name: 'gray',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.13 0.028 261.692)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.13 0.028 261.692)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.13 0.028 261.692)',
    primary: 'oklch(0.21 0.034 264.665)',
    primaryForeground: 'oklch(0.985 0.002 247.839)',
    secondary: 'oklch(0.967 0.003 264.542)',
    secondaryForeground: 'oklch(0.21 0.034 264.665)',
    muted: 'oklch(0.967 0.003 264.542)',
    mutedForeground: 'oklch(0.551 0.027 264.364)',
    accent: 'oklch(0.967 0.003 264.542)',
    accentForeground: 'oklch(0.21 0.034 264.665)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.985 0.002 247.839)',
    border: 'oklch(0.928 0.006 264.531)',
    input: 'oklch(0.928 0.006 264.531)',
    ring: 'oklch(0.707 0.022 261.325)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)'
  },
  dark: {
    background: 'oklch(0.13 0.028 261.692)',
    foreground: 'oklch(0.985 0.002 247.839)',
    card: 'oklch(0.21 0.034 264.665)',
    cardForeground: 'oklch(0.985 0.002 247.839)',
    popover: 'oklch(0.21 0.034 264.665)',
    popoverForeground: 'oklch(0.985 0.002 247.839)',
    primary: 'oklch(0.928 0.006 264.531)',
    primaryForeground: 'oklch(0.21 0.034 264.665)',
    secondary: 'oklch(0.278 0.033 256.848)',
    secondaryForeground: 'oklch(0.985 0.002 247.839)',
    muted: 'oklch(0.278 0.033 256.848)',
    mutedForeground: 'oklch(0.707 0.022 261.325)',
    accent: 'oklch(0.278 0.033 256.848)',
    accentForeground: 'oklch(0.985 0.002 247.839)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.985 0.002 247.839)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.551 0.027 264.364)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)'
  }
};

// Slate theme
export const slateTheme: Theme = {
  name: 'slate',
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.129 0.042 264.695)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.129 0.042 264.695)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.129 0.042 264.695)',
    primary: 'oklch(0.208 0.042 265.755)',
    primaryForeground: 'oklch(0.984 0.003 247.858)',
    secondary: 'oklch(0.968 0.007 247.896)',
    secondaryForeground: 'oklch(0.208 0.042 265.755)',
    muted: 'oklch(0.968 0.007 247.896)',
    mutedForeground: 'oklch(0.554 0.046 257.417)',
    accent: 'oklch(0.968 0.007 247.896)',
    accentForeground: 'oklch(0.208 0.042 265.755)',
    destructive: 'oklch(0.577 0.245 27.325)',
    destructiveForeground: 'oklch(0.984 0.003 247.858)',
    border: 'oklch(0.929 0.013 255.508)',
    input: 'oklch(0.929 0.013 255.508)',
    ring: 'oklch(0.704 0.04 256.788)',
    chart1: 'oklch(0.646 0.222 41.116)',
    chart2: 'oklch(0.6 0.118 184.704)',
    chart3: 'oklch(0.398 0.07 227.392)',
    chart4: 'oklch(0.828 0.189 84.429)',
    chart5: 'oklch(0.769 0.188 70.08)'
  },
  dark: {
    background: 'oklch(0.129 0.042 264.695)',
    foreground: 'oklch(0.984 0.003 247.858)',
    card: 'oklch(0.208 0.042 265.755)',
    cardForeground: 'oklch(0.984 0.003 247.858)',
    popover: 'oklch(0.208 0.042 265.755)',
    popoverForeground: 'oklch(0.984 0.003 247.858)',
    primary: 'oklch(0.929 0.013 255.508)',
    primaryForeground: 'oklch(0.208 0.042 265.755)',
    secondary: 'oklch(0.279 0.041 260.031)',
    secondaryForeground: 'oklch(0.984 0.003 247.858)',
    muted: 'oklch(0.279 0.041 260.031)',
    mutedForeground: 'oklch(0.704 0.04 256.788)',
    accent: 'oklch(0.279 0.041 260.031)',
    accentForeground: 'oklch(0.984 0.003 247.858)',
    destructive: 'oklch(0.704 0.191 22.216)',
    destructiveForeground: 'oklch(0.984 0.003 247.858)',
    border: 'oklch(1 0 0 / 10%)',
    input: 'oklch(1 0 0 / 15%)',
    ring: 'oklch(0.551 0.027 264.364)',
    chart1: 'oklch(0.488 0.243 264.376)',
    chart2: 'oklch(0.696 0.17 162.48)',
    chart3: 'oklch(0.769 0.188 70.08)',
    chart4: 'oklch(0.627 0.265 303.9)',
    chart5: 'oklch(0.645 0.246 16.439)'
  }
};

// Export all themes
export const availableThemes = {
  neutral: neutralTheme,
  stone: stoneTheme,
  zinc: zincTheme,
  gray: grayTheme,
  slate: slateTheme
};

/**
 * Generate CSS variables for a theme
 */
export function generateThemeCssVariables(theme: Theme, isDark: boolean = true): string {
  const colors = isDark ? theme.dark : theme.light;
  
  return `
    --background: ${colors.background};
    --foreground: ${colors.foreground};
    --card: ${colors.card};
    --card-foreground: ${colors.cardForeground};
    --popover: ${colors.popover};
    --popover-foreground: ${colors.popoverForeground};
    --primary: ${colors.primary};
    --primary-foreground: ${colors.primaryForeground};
    --secondary: ${colors.secondary};
    --secondary-foreground: ${colors.secondaryForeground};
    --muted: ${colors.muted};
    --muted-foreground: ${colors.mutedForeground};
    --accent: ${colors.accent};
    --accent-foreground: ${colors.accentForeground};
    --destructive: ${colors.destructive};
    --destructive-foreground: ${colors.destructiveForeground};
    --border: ${colors.border};
    --input: ${colors.input};
    --ring: ${colors.ring};
    --chart-1: ${colors.chart1};
    --chart-2: ${colors.chart2};
    --chart-3: ${colors.chart3};
    --chart-4: ${colors.chart4};
    --chart-5: ${colors.chart5};
    --radius: 0.5rem;
  `.trim();
}

/**
 * Get theme by name with fallback to neutral
 */
export function getThemeByName(themeName: string): Theme {
  return availableThemes[themeName as keyof typeof availableThemes] || neutralTheme;
}