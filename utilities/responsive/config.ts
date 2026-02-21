/**
 * Responsive Configuration & Theme-Aware Constants
 *
 * Centralized configuration for responsive design system
 * Integrates with your existing theme system for consistency
 */

import responsive from "./index";

// ============================================================================
// SPACING SYSTEM (Design Tokens)
// ============================================================================

export const SPACING = {
  // Tight spacing (xs)
  xs: 4,
  // Small spacing (sm)
  sm: 8,
  // Medium spacing (md) - Default
  md: 12,
  // Large spacing (lg)
  lg: 16,
  // Extra large spacing (xl)
  xl: 24,
  // 2x extra large (2xl)
  "2xl": 32,
  // 3x extra large (3xl)
  "3xl": 40,
} as const;

// Responsive spacing (scales by device)
export const getResponsiveSpacingByDevice = () => {
  return {
    xs: responsive.padding(SPACING.xs),
    sm: responsive.padding(SPACING.sm),
    md: responsive.padding(SPACING.md),
    lg: responsive.padding(SPACING.lg),
    xl: responsive.padding(SPACING.xl),
    "2xl": responsive.padding(SPACING["2xl"]),
    "3xl": responsive.padding(SPACING["3xl"]),
  };
};

// ============================================================================
// TYPOGRAPHY SYSTEM (Font Sizes)
// ============================================================================

export const FONT_SIZES = {
  // Display sizes
  display: 48,
  h1: 40,
  h2: 32,
  h3: 28,
  h4: 24,
  h5: 20,
  h6: 16,
  // Body sizes
  body: 16,
  bodyLarge: 18,
  bodyMedium: 16,
  bodySmall: 14,
  // Label sizes
  label: 12,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
  // Caption sizes
  caption: 12,
  captionSmall: 10,
} as const;

// Responsive font sizes (scales by device)
export const getResponsiveFontSizes = () => {
  return Object.entries(FONT_SIZES).reduce(
    (acc, [key, size]) => {
      acc[key as keyof typeof FONT_SIZES] = responsive.fontSizeAdvanced(size);
      return acc;
    },
    {} as Record<keyof typeof FONT_SIZES, number>
  );
};

// ============================================================================
// BORDER RADIUS (Rounded Corners)
// ============================================================================

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
} as const;

// Responsive border radius
export const getResponsiveBorderRadius = () => {
  return Object.entries(BORDER_RADIUS).reduce(
    (acc, [key, radius]) => {
      acc[key as keyof typeof BORDER_RADIUS] = responsive.borderRadius(radius);
      return acc;
    },
    {} as Record<keyof typeof BORDER_RADIUS, number>
  );
};

// ============================================================================
// ICON SIZES
// ============================================================================

export const ICON_SIZES = {
  xs: 16, // Small icons (badges, indicators)
  sm: 20, // Small icons (toolbar)
  md: 24, // Medium icons (standard)
  lg: 32, // Large icons (feature)
  xl: 40, // Extra large icons (hero)
  "2xl": 48, // 2x large (prominent)
  "3xl": 56, // 3x large (massive)
} as const;

// Responsive icon sizes
export const getResponsiveIconSizes = () => {
  return Object.entries(ICON_SIZES).reduce(
    (acc, [key, size]) => {
      acc[key as keyof typeof ICON_SIZES] = responsive.iconSize(size);
      return acc;
    },
    {} as Record<keyof typeof ICON_SIZES, number>
  );
};

// ============================================================================
// COMPONENT SIZING
// ============================================================================

export const COMPONENT_SIZES = {
  // Button sizes
  button: {
    small: {
      height: 32,
      paddingHorizontal: SPACING.md,
      fontSize: FONT_SIZES.labelMedium,
    },
    medium: {
      height: 44,
      paddingHorizontal: SPACING.lg,
      fontSize: FONT_SIZES.body,
    },
    large: {
      height: 56,
      paddingHorizontal: SPACING.xl,
      fontSize: FONT_SIZES.bodyLarge,
    },
  },
  // Input/TextField sizes
  input: {
    small: {
      height: 36,
      paddingHorizontal: SPACING.md,
      fontSize: FONT_SIZES.bodySmall,
    },
    medium: {
      height: 44,
      paddingHorizontal: SPACING.lg,
      fontSize: FONT_SIZES.body,
    },
    large: {
      height: 56,
      paddingHorizontal: SPACING.xl,
      fontSize: FONT_SIZES.bodyLarge,
    },
  },
  // Card sizes
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  // Modal sizes
  modal: {
    minWidth: 280,
    maxWidth: 500,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
  },
} as const;

// ============================================================================
// LINE HEIGHT SYSTEM
// ============================================================================

export const LINE_HEIGHTS = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.8,
} as const;

export const getLineHeight = (fontSize: number, type: keyof typeof LINE_HEIGHTS = "normal") => {
  return responsive.lineHeight(Math.round(fontSize * LINE_HEIGHTS[type]));
};

// ============================================================================
// SHADOW/ELEVATION SYSTEM
// ============================================================================

export const SHADOWS = {
  none: { shadowOpacity: 0 },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
} as const;

// ============================================================================
// BREAKPOINT CONFIG
// ============================================================================

export const BREAKPOINTS = {
  mobile: 600,
  tablet: 900,
  desktop: 1280,
} as const;

// ============================================================================
// Z-INDEX SYSTEM (Stacking Order)
// ============================================================================

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
} as const;

// ============================================================================
// ANIMATION/TRANSITION DURATIONS (milliseconds)
// ============================================================================

export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 1000,
} as const;

// ============================================================================
// PRESETS - Complete Style Objects
// ============================================================================

export const STYLE_PRESETS = {
  // Container presets
  container: {
    padding: responsive.padding(SPACING.lg),
    backgroundColor: "#fff",
    borderRadius: responsive.borderRadius(BORDER_RADIUS.lg),
  },

  // Card presets
  card: {
    padding: responsive.padding(SPACING.lg),
    backgroundColor: "#fff",
    borderRadius: responsive.borderRadius(BORDER_RADIUS.lg),
    ...SHADOWS.md,
  },

  // Input presets
  input: {
    paddingVertical: responsive.padding(SPACING.md),
    paddingHorizontal: responsive.padding(SPACING.lg),
    fontSize: responsive.fontSizeAdvanced(FONT_SIZES.body),
    borderRadius: responsive.borderRadius(BORDER_RADIUS.md),
    borderWidth: 1,
  },

  // Button presets
  buttonPrimary: {
    paddingVertical: responsive.padding(SPACING.md),
    paddingHorizontal: responsive.padding(SPACING.lg),
    borderRadius: responsive.borderRadius(BORDER_RADIUS.md),
    alignItems: "center",
    justifyContent: "center",
  },
};

// ============================================================================
// RESPONSIVE GRID CONFIG
// ============================================================================

export const GRID_CONFIG = {
  mobile: {
    columns: 1,
    gap: responsive.padding(SPACING.md),
    padding: responsive.padding(SPACING.md),
  },
  tablet: {
    columns: 2,
    gap: responsive.padding(SPACING.lg),
    padding: responsive.padding(SPACING.lg),
  },
  desktop: {
    columns: 3,
    gap: responsive.padding(SPACING.xl),
    padding: responsive.padding(SPACING.xl),
  },
} as const;

// ============================================================================
// SCREEN SIZE UTILITIES
// ============================================================================

export const getScreenSizeCategory = (width: number) => {
  if (width < BREAKPOINTS.mobile) return "mobile";
  if (width < BREAKPOINTS.tablet) return "tablet";
  return "desktop";
};

export const getGridConfigByWidth = (width: number) => {
  const category = getScreenSizeCategory(width);
  return GRID_CONFIG[category];
};

// ============================================================================
// LAYOUT PRESETS
// ============================================================================

export const LAYOUT_PRESETS = {
  // Page container with padding
  pageContainer: {
    flex: 1,
    paddingHorizontal: responsive.padding(SPACING.lg),
    paddingVertical: responsive.padding(SPACING.md),
    backgroundColor: "#f5f5f5",
  },

  // Card container
  cardContainer: {
    paddingHorizontal: responsive.padding(SPACING.lg),
    paddingVertical: responsive.padding(SPACING.md),
    marginBottom: responsive.margin(SPACING.md),
    backgroundColor: "#fff",
    borderRadius: responsive.borderRadius(BORDER_RADIUS.lg),
    ...SHADOWS.md,
  },

  // List container
  listContainer: {
    paddingHorizontal: responsive.padding(SPACING.md),
    paddingVertical: responsive.padding(SPACING.sm),
  },

  // List item
  listItem: {
    paddingHorizontal: responsive.padding(SPACING.lg),
    paddingVertical: responsive.padding(SPACING.md),
    marginVertical: responsive.margin(SPACING.xs),
  },

  // Modal container
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  // Modal content
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: responsive.borderRadius(BORDER_RADIUS.xl),
    padding: responsive.padding(SPACING.xl),
    minWidth: Math.min(COMPONENT_SIZES.modal.minWidth, 300),
    maxWidth: COMPONENT_SIZES.modal.maxWidth,
  },
} as const;

// ============================================================================
// SAFE AREA PADDING (For notched devices)
// ============================================================================

export const getSafeAreaPadding = (hasNotch: boolean = false) => {
  return {
    top: hasNotch ? responsive.padding(SPACING.lg) : responsive.padding(SPACING.md),
    bottom: hasNotch ? responsive.padding(SPACING.lg) : responsive.padding(SPACING.md),
    left: responsive.padding(SPACING.md),
    right: responsive.padding(SPACING.md),
  };
};

// ============================================================================
// COLOR & THEME UTILITIES
// ============================================================================

export const OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  focus: 0.9,
  active: 1,
} as const;

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export const ResponsiveConfig = {
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  ICON_SIZES,
  COMPONENT_SIZES,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATIONS,
  STYLE_PRESETS,
  GRID_CONFIG,
  LAYOUT_PRESETS,
  OPACITY,
  getResponsiveSpacingByDevice,
  getResponsiveFontSizes,
  getResponsiveBorderRadius,
  getResponsiveIconSizes,
  getLineHeight,
  getScreenSizeCategory,
  getGridConfigByWidth,
  getSafeAreaPadding,
} as const;

export default ResponsiveConfig;
