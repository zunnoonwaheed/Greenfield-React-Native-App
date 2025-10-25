// Design System Constants for Greenfield Grocery App
// Figma Design - 430×932 resolution

export const Colors = {
  primary: '#008C4A',      // Green primary from Figma
  primaryDark: '#007A3D',  // Darker green for headers
  primaryLight: '#00A854', // Light green for accents
  secondary: '#A3F7CD',    // Light mint for highlights
  addToCart: '#00875A',    // Green for Add to Cart buttons

  accent: '#FF6B35',       // Orange for prices (from Figma)
  warning: '#FFB800',      // Yellow for discount badges

  background: '#FFFFFF',   // Pure white background
  backgroundGray: '#F5F5F5', // Light gray sections
  surface: '#FFFFFF',      // White surface
  border: '#E0E0E0',       // Gray borders
  borderLight: '#EBEBEB',  // Lighter borders

  text: {
    primary: '#000000',    // Pure black for main text
    secondary: '#424242',  // Dark gray for secondary text
    tertiary: '#757575',   // Medium gray for descriptions
    placeholder: '#9E9E9E', // Light gray for placeholders
  },

  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

export const Typography = {
  fontFamily: {
    sans: 'DM Sans',
    display: 'SF Pro Display',
    poppins: 'Poppins',
  },

  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },

  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeight: {
    tight: 18,
    normal: 20,
    relaxed: 24,
  },
};

export const Spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Layout = {
  screenWidth: 430,
  screenHeight: 932,
  contentPadding: 32,
  cardGap: 12,
};
