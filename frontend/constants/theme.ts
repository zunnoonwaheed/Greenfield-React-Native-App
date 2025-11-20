// ============================================
// THEME CONFIGURATION
// Centralized theme constants for Greenfield app
// ============================================

/**
 * Color palette for the application
 */
export const Colors = {
  // Primary colors
  primary: '#026A49',       // Dark Green - main brand color
  primaryDark: '#015438',   // Darker green for pressed states
  primaryLight: '#038558',  // Lighter green for backgrounds

  // Secondary colors
  secondary: '#E9C46A',     // Golden yellow
  secondaryDark: '#D4AF4F',
  secondaryLight: '#F0D284',

  // Accent colors
  accent: '#F4A261',        // Orange accent
  accentDark: '#E08D4A',
  accentLight: '#F7B77D',

  // Neutral colors
  background: '#FFFFFF',    // White background
  backgroundGray: '#F8F9FA', // Light gray background
  backgroundDark: '#E9ECEF', // Darker gray background
  surface: '#FFFFFF',       // Surface/card background

  // Text colors
  text: '#264653',          // Dark blue-gray for main text
  textSecondary: '#6C757D', // Medium gray for secondary text
  textLight: '#ADB5BD',     // Light gray for disabled/placeholder
  textWhite: '#FFFFFF',     // White text for dark backgrounds

  // Semantic colors
  success: '#28A745',       // Green for success states
  successLight: '#D1FAE5',  // Light green background
  successDark: '#059669',   // Dark green text
  warning: '#FFC107',       // Amber for warnings
  error: '#DC3545',         // Red for errors
  info: '#17A2B8',          // Blue for info

  // UI colors
  border: '#DEE2E6',        // Border color
  borderLight: '#DEE2E6',   // Light border
  borderDark: '#CED4DA',    // Darker border
  divider: '#E9ECEF',       // Divider lines
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay

  // Gray scale
  gray: {
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#000000',
  },

  // Special colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Typography scale and font properties
 */
export const Typography = {
  // Font sizes (flat structure)
  h1: 32,           // Large headings
  h2: 28,           // Section headings
  h3: 24,           // Subsection headings
  h4: 20,           // Card titles
  h5: 18,           // List titles
  h6: 16,           // Small headings

  heading: 24,      // Generic heading
  subheading: 18,   // Generic subheading
  body: 16,         // Body text
  bodySmall: 14,    // Small body text
  caption: 12,      // Captions and labels
  tiny: 10,         // Very small text

  // Font weights
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line heights (relative to font size)
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

/**
 * Spacing scale (in pixels)
 */
export const Spacing = {
  xs: 4,            // Extra small spacing
  small: 8,         // Small spacing
  medium: 16,       // Medium spacing (default)
  large: 24,        // Large spacing
  xl: 32,           // Extra large spacing
  xxl: 40,          // 2x extra large spacing
  extraLarge: 32,   // Alias for xl

  // Semantic spacing
  padding: 16,      // Default padding
  margin: 16,       // Default margin
  gap: 12,          // Gap between items

  // Screen spacing
  screenPadding: 20,    // Horizontal screen padding
  sectionSpacing: 24,   // Vertical section spacing
};

/**
 * Border radius values (in pixels)
 */
export const BorderRadius = {
  none: 0,          // No radius
  xs: 4,            // Extra small radius
  sm: 6,            // Small radius
  small: 6,         // Small radius for buttons
  md: 12,           // Medium radius
  medium: 12,       // Medium radius for cards
  lg: 20,           // Large radius
  large: 20,        // Large radius for containers
  xl: 28,           // Extra large radius
  round: 999,       // Fully rounded (for circles)

  // Semantic values
  button: 8,        // Default button radius
  card: 12,         // Default card radius
  input: 10,        // Input field radius
  modal: 16,        // Modal/bottom sheet radius
};

/**
 * Shadow presets for elevation
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },

  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },

  // Semantic shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
};

/**
 * Animation durations (in milliseconds)
 */
export const Animations = {
  fast: 200,        // Fast animations
  normal: 300,      // Normal animations
  slow: 500,        // Slow animations
};

/**
 * Layout constants
 */
export const Layout = {
  maxWidth: 1200,           // Max content width for web
  headerHeight: 60,         // Header/navbar height
  tabBarHeight: 60,         // Bottom tab bar height
  buttonHeight: 48,         // Standard button height
  inputHeight: 48,          // Standard input height
  iconSize: 24,             // Default icon size
  avatarSize: 40,           // Default avatar size
  bannerHeight: 280,        // Image banner height
};

// Export all as a single theme object (optional, for convenience)
export const Theme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animations,
  Layout,
};

export default Theme;
