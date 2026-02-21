import { useState, useEffect } from 'react';
/**
 * Web-specific responsive utilities
 * Handles layout patterns specific to web applications
 * Desktop-first or mobile-first responsive design
 */

import { Platform , Dimensions } from "react-native";
import responsive from ".";

// ============================================================================
// WEB LAYOUT CONSTANTS
// ============================================================================

export const WebBreakpoints = {
  xs: 0, // Extra small (mobile)
  sm: 576, // Small (landscape phones)
  md: 768, // Medium (tablets)
  lg: 992, // Large (desktops)
  xl: 1200, // Extra large (wide screens)
  xxl: 1400, // Extra extra large (ultra-wide screens)
} as const;

export const WebMaxWidths = {
  container: 1320,
  tablet: 960,
  mobile: 540,
} as const;

// ============================================================================
// CSS GRID & FLEXBOX UTILITIES
// ============================================================================

/**
 * Get grid columns based on screen size (mobile-first)
 * Mobile: 1 column, Tablet: 2 columns, Desktop: 3+ columns
 */
export const getGridColumns = (width: number): number => {
  if (width >= WebBreakpoints.xxl) return 4;
  if (width >= WebBreakpoints.xl) return 4;
  if (width >= WebBreakpoints.lg) return 3;
  if (width >= WebBreakpoints.md) return 2;
  return 1;
};

/**
 * Get grid gap/spacing based on screen size
 */
export const getGridGap = (width: number): number => {
  if (width >= WebBreakpoints.lg) return responsive.padding(24);
  if (width >= WebBreakpoints.md) return responsive.padding(16);
  return responsive.padding(12);
};

/**
 * Get responsive container width
 */
export const getContainerWidth = (width: number, fullWidth: boolean = false): number => {
  if (fullWidth) return width;

  if (width >= WebBreakpoints.xxl) return Math.min(width * 0.9, WebMaxWidths.container);
  if (width >= WebBreakpoints.xl) return Math.min(width * 0.92, WebMaxWidths.container);
  if (width >= WebBreakpoints.lg) return Math.min(width * 0.95, WebMaxWidths.container);
  if (width >= WebBreakpoints.md) return Math.min(width * 0.97, WebMaxWidths.tablet);
  return width - responsive.padding(12) * 2;
};

/**
 * Get responsive sidebar width (for desktop layouts)
 */
export const getSidebarWidth = (width: number): number => {
  if (width >= WebBreakpoints.lg) return Math.min(300, width * 0.25);
  if (width >= WebBreakpoints.md) return Math.min(250, width * 0.3);
  return 0; // Hidden on mobile
};

/**
 * Check if sidebar should be visible (desktop only)
 */
export const shouldShowSidebar = (width: number): boolean => {
  return width >= WebBreakpoints.lg;
};

/**
 * Get responsive font size for web (with better scaling)
 */
export const getWebFontSize = (
  baseSize: number,
  width: number,
  minSize?: number,
  maxSize?: number
): number => {
  const min = minSize || Math.round(baseSize * 0.8);
  const max = maxSize || Math.round(baseSize * 1.4);

  // Fluid typography: scale between min and max
  const scale = (width - WebBreakpoints.sm) / (WebBreakpoints.xxl - WebBreakpoints.sm);
  const scaledSize = Math.round(min + (max - min) * Math.max(0, Math.min(1, scale)));

  return Math.max(min, Math.min(max, scaledSize));
};

/**
 * Get responsive element spacing (consistent with design system)
 */
export const getResponsiveSpacing = (
  spacingLevel: "xs" | "sm" | "md" | "lg" | "xl",
  width: number
): number => {
  const spacingMap = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const baseValue = spacingMap[spacingLevel];

  // Scale spacing based on screen size
  if (width >= WebBreakpoints.lg) return Math.round(baseValue * 1.2);
  if (width >= WebBreakpoints.md) return baseValue;
  if (width >= WebBreakpoints.sm) return Math.round(baseValue * 0.9);
  return Math.round(baseValue * 0.8);
};

// ============================================================================
// MEDIA QUERY HELPERS (for CSS-in-JS if using styled-components or similar)
// ============================================================================

export const mediaQueries = {
  xs: `(min-width: ${WebBreakpoints.xs}px)`,
  sm: `(min-width: ${WebBreakpoints.sm}px)`,
  md: `(min-width: ${WebBreakpoints.md}px)`,
  lg: `(min-width: ${WebBreakpoints.lg}px)`,
  xl: `(min-width: ${WebBreakpoints.xl}px)`,
  xxl: `(min-width: ${WebBreakpoints.xxl}px)`,
  mobileOnly: `(max-width: ${WebBreakpoints.sm - 1}px)`,
  tabletAndUp: `(min-width: ${WebBreakpoints.md}px)`,
  desktopAndUp: `(min-width: ${WebBreakpoints.lg}px)`,
} as const;

// ============================================================================
// WEB LAYOUT STYLES
// ============================================================================

/**
 * Get standard container styles
 */
export const getContainerStyles = (width: number, paddingHorizontal = true) => {
  const containerWidth = getContainerWidth(width);
  const horizontalPadding = paddingHorizontal ? responsive.padding(16) : 0;

  return {
    maxWidth: containerWidth,
    marginHorizontal: "auto" as const,
    paddingHorizontal: horizontalPadding,
    width: "100%",
  };
};

/**
 * Get responsive grid styles
 */
export const getGridStyles = (width: number, columns?: number) => {
  const cols = columns || getGridColumns(width);
  const gap = getGridGap(width);

  return {
    display: "grid" as const,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: gap,
  };
};

/**
 * Get responsive flexbox styles for responsive layout
 */
export const getResponsiveFlexStyles = (width: number, direction: "row" | "column" = "column") => {
  // Stack vertically on mobile, horizontally on desktop
  const flexDirection = width >= WebBreakpoints.md ? "row" : "column";
  const justifyContent = width >= WebBreakpoints.lg ? "space-between" : "flex-start";

  return {
    display: "flex" as const,
    flexDirection: direction === "row" && width < WebBreakpoints.md ? "column" : direction,
    justifyContent,
    gap: responsive.padding(16),
  };
};

/**
 * Hook to check if running on web platform
 */
export const useIsWeb = (): boolean => {
  return Platform.OS === "web";
};

/**
 * Hook to get current breakpoint
 */
export const useWebBreakpoint = (): keyof typeof WebBreakpoints => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof WebBreakpoints>("xs");

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const updateBreakpoint = () => {
      const { width } = Dimensions.get("window");

      if (width >= WebBreakpoints.xxl) setBreakpoint("xxl");
      else if (width >= WebBreakpoints.xl) setBreakpoint("xl");
      else if (width >= WebBreakpoints.lg) setBreakpoint("lg");
      else if (width >= WebBreakpoints.md) setBreakpoint("md");
      else if (width >= WebBreakpoints.sm) setBreakpoint("sm");
      else setBreakpoint("xs");
    };

    updateBreakpoint();
    const subscription = Dimensions.addEventListener("change", updateBreakpoint);

    return () => {
      subscription?.remove();
    };
  }, []);

  return breakpoint;
};

/**
 * Hook to get responsive grid columns
 */
export const useGridColumns = (): number => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const updateColumns = () => {
      const { width } = Dimensions.get("window");
      setColumns(getGridColumns(width));
    };

    updateColumns();
    const subscription = Dimensions.addEventListener("change", updateColumns);

    return () => {
      subscription?.remove();
    };
  }, []);

  return columns;
};

/**
 * Hook to get responsive container width
 */
export const useContainerWidth = (fullWidth: boolean = false): number => {
  const [containerWidth, setContainerWidth] = useState(() => {
    const { width } = Dimensions.get("window");
    return getContainerWidth(width, fullWidth);
  });

  useEffect(() => {
    const updateWidth = () => {
      const { width } = Dimensions.get("window");
      setContainerWidth(getContainerWidth(width, fullWidth));
    };

    const subscription = Dimensions.addEventListener("change", updateWidth);

    return () => {
      subscription?.remove();
    };
  }, [fullWidth]);

  return containerWidth;
};

/**
 * Hook to check if layout should show sidebar
 */
export const useShouldShowSidebar = (): boolean => {
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    const { width } = Dimensions.get("window");
    return shouldShowSidebar(width);
  });

  useEffect(() => {
    const updateSidebar = () => {
      const { width } = Dimensions.get("window");
      setShowSidebar(shouldShowSidebar(width));
    };

    const subscription = Dimensions.addEventListener("change", updateSidebar);

    return () => {
      subscription?.remove();
    };
  }, []);

  return showSidebar;
};

/**
 * Hook to get sidebar width
 */
export const useSidebarWidth = (): number => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const { width } = Dimensions.get("window");
    return getSidebarWidth(width);
  });

  useEffect(() => {
    const updateSidebarWidth = () => {
      const { width } = Dimensions.get("window");
      setSidebarWidth(getSidebarWidth(width));
    };

    const subscription = Dimensions.addEventListener("change", updateSidebarWidth);

    return () => {
      subscription?.remove();
    };
  }, []);

  return sidebarWidth;
};

/**
 * Hook to get responsive grid gap
 */
export const useGridGap = (): number => {
  const [gap, setGap] = useState(() => {
    const { width } = Dimensions.get("window");
    return getGridGap(width);
  });

  useEffect(() => {
    const updateGap = () => {
      const { width } = Dimensions.get("window");
      setGap(getGridGap(width));
    };

    const subscription = Dimensions.addEventListener("change", updateGap);

    return () => {
      subscription?.remove();
    };
  }, []);

  return gap;
};
