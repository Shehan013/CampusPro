
import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Primary colors - Light Blue Theme
    primary: '#4A90E2',
    secondary: '#5BA3F5',
    accent: '#2E7BD4',
    
    // Background colors
    background: '#F9FBFF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    
    // Tab navigation
    tint: '#4A90E2',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#4A90E2',
    icon: '#6B7280',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Border and divider
    border: '#E5E7EB',
    divider: '#F3F4F6',
    
    // Input fields
    inputBackground: '#F9FAFB',
    inputBorder: '#D1D5DB',
    inputText: '#1A1A2E',
    
    // Event type colors
    eventAssignment: '#F59E0B',
    eventEntertainment: '#8B5CF6',
    eventExam: '#EF4444',
    eventSpecial: '#EC4899',
    eventSport: '#10B981',
    eventIndustry: '#3B82F6',
  },
  
  dark: {
    // Primary colors - Dark mode adjusted
    primary: '#5BA3F5',
    secondary: '#4A90E2',
    accent: '#6BB3FF',
    
    // Background colors
    background: '#1A1A2E',
    surface: '#252A3F',
    card: '#2D3349',
    
    // Text colors
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    
    // Tab navigation
    tint: '#5BA3F5',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#5BA3F5',
    icon: '#D1D5DB',
    
    // Status colors
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    
    // Border and divider
    border: '#374151',
    divider: '#1F2937',
    
    // Input fields
    inputBackground: '#1F2937',
    inputBorder: '#374151',
    inputText: '#F9FAFB',
    
    // Event type colors
    eventAssignment: '#FBBF24',
    eventEntertainment: '#A78BFA',
    eventExam: '#F87171',
    eventSpecial: '#F472B6',
    eventSport: '#34D399',
    eventIndustry: '#60A5FA',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
