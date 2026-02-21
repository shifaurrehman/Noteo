import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

export type DeviceType = "mobile" | "tablet" | "desktop" | "web";
export type Orientation = "portrait" | "landscape";

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveConfig {
  baseWidth: number;
  baseHeight: number;
  breakpoints: ResponsiveBreakpoints;
}

export interface ResponsiveValues {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  deviceType: DeviceType;
  orientation: Orientation;
  fontScale: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Base dimensions for iPhone SE (smallest common device)
const DEFAULT_CONFIG: ResponsiveConfig = {
  baseWidth: 375,
  baseHeight: 812,
  breakpoints: {
    mobile: 600,
    tablet: 900,
    desktop: 1280,
  },
};

const BREAKPOINTS = DEFAULT_CONFIG.breakpoints;

const getDeviceDimensions = () => {
  const dim = Dimensions.get("window");
  return {
    width: dim.width,
    height: dim.height,
  };
};

/**
 * Determine device type based on screen width
 */
const getDeviceType = (width: number): DeviceType => {
  if (Platform.OS === "web") {
    if (width >= BREAKPOINTS.desktop) return "desktop";
    if (width >= BREAKPOINTS.tablet) return "tablet";
    return "mobile";
  }
  return "mobile";
};


const getOrientation = (width: number, height: number): Orientation => {
  return width > height ? "landscape" : "portrait";
};

const scaleSize = (size: number, currentWidth: number = DEFAULT_CONFIG.baseWidth): number => {
  return (currentWidth / DEFAULT_CONFIG.baseWidth) * size;
};

const scaleVerticalSize = (size: number, currentHeight: number = DEFAULT_CONFIG.baseHeight): number => {
  return (currentHeight / DEFAULT_CONFIG.baseHeight) * size;
};

const calculateResponsiveFontSize = (
  size: number,
  width: number = DEFAULT_CONFIG.baseWidth,
  height: number = DEFAULT_CONFIG.baseHeight
): number => {
  const scaleFactor = Math.min(width / DEFAULT_CONFIG.baseWidth, height / DEFAULT_CONFIG.baseHeight);
  return Math.round(size * scaleFactor);
};

const getFontScaleFactor = async (): Promise<number> => {
  try {
    if (Platform.OS === "ios") {
      // iOS has native font scaling
      const dim = Dimensions.get("window");
      // Max font scale is typically 1.3 for accessibility
      return 1;
    }
    if (Platform.OS === "android") {
      // Android has native font scaling
      return 1;
    }
    // Web
    return 1;
  } catch {
    return 1;
  }
};

/**
 * Advanced responsive font size with better scaling algorithm
 * Logarithmic scaling prevents extreme sizes
 */
const advancedResponsiveFontSize = (
  baseSize: number,
  width: number = DEFAULT_CONFIG.baseWidth,
  height: number = DEFAULT_CONFIG.baseHeight
): number => {
  const scale = Math.min(width / DEFAULT_CONFIG.baseWidth, height / DEFAULT_CONFIG.baseHeight);
  const adjustedScale = Math.max(0.8, Math.min(scale, 1.3));
  return Math.round(baseSize * adjustedScale);
};

class ResponsiveUtils {
  private config: ResponsiveConfig;
  private fontScaleFactor: number = 1;

  constructor(config: ResponsiveConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  width = (size: number, baseWidth?: number): number => {
    return scaleSize(size, baseWidth);
  };

  height = (size: number, baseHeight?: number): number => {
    return scaleVerticalSize(size, baseHeight);
  };

  fontSize = (size: number, width?: number, height?: number): number => {
    const scaledSize = calculateResponsiveFontSize(size, width, height);
    return Math.round(scaledSize * this.fontScaleFactor);
  };


  fontSizeAdvanced = (size: number, width?: number, height?: number): number => {
    const scaledSize = advancedResponsiveFontSize(size, width, height);
    return Math.round(scaledSize * this.fontScaleFactor);
  };

  margin = (size: number, baseWidth?: number): number => {
    return scaleSize(size, baseWidth);
  };

  padding = (size: number, baseWidth?: number): number => {
    return scaleSize(size, baseWidth);
  };

  borderRadius = (size: number, baseWidth?: number): number => {
    return Math.round(scaleSize(size, baseWidth));
  };


  iconSize = (size: number, baseWidth?: number): number => {
    return Math.round(scaleSize(size, baseWidth));
  };

  lineHeight = (size: number, baseWidth?: number): number => {
    return Math.round(scaleVerticalSize(size));
  };

  getResponsiveValues = (): ResponsiveValues => {
    const { width, height } = getDeviceDimensions();
    const orientation = getOrientation(width, height);

    return {
      width,
      height,
      isPortrait: orientation === "portrait",
      isLandscape: orientation === "landscape",
      deviceType: getDeviceType(width),
      orientation,
      fontScale: this.fontScaleFactor,
    };
  };


  isMobile = (): boolean => {
    const { width } = getDeviceDimensions();
    return getDeviceType(width) === "mobile";
  };

  isTablet = (): boolean => {
    const { width } = getDeviceDimensions();
    return getDeviceType(width) === "tablet";
  };

  /**
   * Check if device is desktop or large web view
   */
  isDesktop = (): boolean => {
    const { width } = getDeviceDimensions();
    return getDeviceType(width) === "desktop";
  };

  /**
   * Check if device is in portrait mode
   */
  isPortrait = (): boolean => {
    const { width, height } = getDeviceDimensions();
    return getOrientation(width, height) === "portrait";
  };

  /**
   * Check if device is in landscape mode
   */
  isLandscape = (): boolean => {
    const { width, height } = getDeviceDimensions();
    return getOrientation(width, height) === "landscape";
  };

  /**
   * Get maximum width for content (useful for web)
   */
  getMaxContentWidth = (): number => {
    const { width } = getDeviceDimensions();
    const { deviceType } = this.getResponsiveValues();

    if (deviceType === "desktop") {
      return Math.min(width * 0.9, 1200);
    }
    if (deviceType === "tablet") {
      return Math.min(width * 0.95, 900);
    }
    return width;
  };

  /**
   * Get padding/margin for different breakpoints
   */
  getSpacing = (category: "tight" | "normal" | "loose"): number => {
    const { width } = getDeviceDimensions();
    const baseSpacing = { tight: 8, normal: 16, loose: 24 };
    return Math.round(scaleSize(baseSpacing[category], width));
  };

  /**
   * Memoized breakpoint checker
   */
  matchesBreakpoint = (breakpoint: keyof ResponsiveBreakpoints): boolean => {
    const { width } = getDeviceDimensions();
    const breakpointValue = this.config.breakpoints[breakpoint];
    return width >= breakpointValue;
  };
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const responsive = new ResponsiveUtils();

export default responsive;

// ============================================================================
// REACT HOOKS FOR RESPONSIVE BEHAVIOR
// ============================================================================

/**
 * Hook to listen to dimension changes
 * Returns current responsive values
 */
export const useResponsive = (): ResponsiveValues => {
  const [values, setValues] = useState<ResponsiveValues>(() => responsive.getResponsiveValues());

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setValues(responsive.getResponsiveValues());
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return values;
};

/**
 * Hook to get memoized responsive font size
 * Updates when screen dimensions change
 */
export const useResponsiveFontSize = (baseSize: number): number => {
  const { width, height } = useResponsive();

  return useMemo(() => {
    return responsive.fontSizeAdvanced(baseSize, width, height);
  }, [baseSize, width, height]);
};

/**
 * Hook to check if device is mobile
 */
export const useIsMobile = (): boolean => {
  const { deviceType } = useResponsive();
  return deviceType === "mobile";
};

/**
 * Hook to check if device is tablet
 */
export const useIsTablet = (): boolean => {
  const { deviceType } = useResponsive();
  return deviceType === "tablet";
};

/**
 * Hook to check if device is desktop
 */
export const useIsDesktop = (): boolean => {
  const { deviceType } = useResponsive();
  return deviceType === "desktop";
};

/**
 * Hook to get current device type
 */
export const useDeviceType = (): DeviceType => {
  const { deviceType } = useResponsive();
  return deviceType;
};

/**
 * Hook to get current orientation
 */
export const useOrientation = (): Orientation => {
  const { orientation } = useResponsive();
  return orientation;
};

/**
 * Hook to check if portrait mode
 */
export const useIsPortrait = (): boolean => {
  const { isPortrait } = useResponsive();
  return isPortrait;
};

/**
 * Hook to check if landscape mode
 */
export const useIsLandscape = (): boolean => {
  const { isLandscape } = useResponsive();
  return isLandscape;
};

/**
 * Hook to get responsive spacing
 */
export const useSpacing = (category: "tight" | "normal" | "loose" = "normal"): number => {
  const { width } = useResponsive();

  return useMemo(() => {
    return responsive.getSpacing(category);
  }, [width, category]);
};

/**
 * Hook to get max content width (useful for web layouts)
 */
export const useMaxContentWidth = (): number => {
  const { width } = useResponsive();

  return useMemo(() => {
    return responsive.getMaxContentWidth();
  }, [width]);
};

/**
 * Reactive padding based on device type
 */
export const usePaddingByDevice = (): number => {
  const { deviceType } = useResponsive();

  return useMemo(() => {
    const paddingMap = {
      mobile: 12,
      tablet: 16,
      desktop: 20,
      web: 24,
    };
    return responsive.padding(paddingMap[deviceType]);
  }, [deviceType]);
};

// ============================================================================
// EXPORTS
// ============================================================================

export { getDeviceType, getOrientation, ResponsiveUtils };

