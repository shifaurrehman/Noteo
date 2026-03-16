export const FONT_SIZE_SCALES = {
  small: 0.85,
  medium: 1,
  large: 1.15,
};

export const BASE_FONT_SIZES = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  sub: 10,
};

export type TypographyType = typeof BASE_FONT_SIZES;

export const getScaledTypography = (scaleKey: keyof typeof FONT_SIZE_SCALES = 'medium'): TypographyType => {
  const scale = FONT_SIZE_SCALES[scaleKey];
  
  return {
    h1: Math.round(BASE_FONT_SIZES.h1 * scale),
    h2: Math.round(BASE_FONT_SIZES.h2 * scale),
    h3: Math.round(BASE_FONT_SIZES.h3 * scale),
    body: Math.round(BASE_FONT_SIZES.body * scale),
    bodySmall: Math.round(BASE_FONT_SIZES.bodySmall * scale),
    caption: Math.round(BASE_FONT_SIZES.caption * scale),
    sub: Math.round(BASE_FONT_SIZES.sub * scale),
  };
};
