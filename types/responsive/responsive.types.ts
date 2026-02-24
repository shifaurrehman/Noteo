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