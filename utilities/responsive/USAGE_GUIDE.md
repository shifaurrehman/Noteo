/\*\*

- RESPONSIVE UTILITIES - PRODUCTION USAGE GUIDE
-
- This file demonstrates best practices for using the responsive utilities
- throughout your application for both mobile and web platforms.
-
- Files included:
- - index.ts: Core responsive utilities and React hooks
- - web.ts: Web-specific responsive utilities and layouts
    \*/

// ============================================================================
// QUICK START EXAMPLES
// ============================================================================

/\*\*

- EXAMPLE 1: Using responsive in StyleSheet (Most Common)
-
- import { StyleSheet } from 'react-native';
- import responsive from '@/utilities/responsive';
-
- const styles = StyleSheet.create({
- container: {
-     padding: responsive.padding(16),
-     borderRadius: responsive.borderRadius(12),
- },
- title: {
-     fontSize: responsive.fontSizeAdvanced(24),
-     marginBottom: responsive.margin(20),
- },
- icon: {
-     width: responsive.iconSize(32),
-     height: responsive.iconSize(32),
- },
- });
  \*/

/\*\*

- EXAMPLE 2: Using responsive hooks in components (Recommended for Dynamic Layouts)
-
- import React from 'react';
- import { View, Text } from 'react-native';
- import { useResponsive, useIsMobile, useIsPortrait } from '@/utilities/responsive';
-
- export const ResponsiveComponent = () => {
- const responsive = useResponsive();
- const isMobile = useIsMobile();
- const isPortrait = useIsPortrait();
-
- return (
-     <View style={{
-       padding: responsive.isPortrait ? 12 : 24,
-       flexDirection: isMobile ? 'column' : 'row',
-     }}>
-       <Text>Device Type: {responsive.deviceType}</Text>
-       <Text>Width: {responsive.width}px</Text>
-     </View>
- );
- };
  \*/

/\*\*

- EXAMPLE 3: Using web-specific utilities for desktop layouts
-
- import React from 'react';
- import { View } from 'react-native';
- import {
- getGridColumns,
- getGridGap,
- getContainerStyles,
- useGridColumns,
- useContainerWidth,
- } from '@/utilities/responsive/web';
-
- export const ResponsiveGridComponent = () => {
- const columns = useGridColumns();
- const containerWidth = useContainerWidth();
-
- return (
-     <View style={{
-       display: 'grid',
-       gridTemplateColumns: `repeat(${columns}, 1fr)`,
-       gap: 16,
-       width: containerWidth,
-     }}>
-       {/* Grid items */}
-     </View>
- );
- };
  \*/

// ============================================================================
// CORE API USAGE
// ============================================================================

/\*\*

- Direct Utility Methods (Non-React, Immediate Values)
- Use these when you don't need reactive updates
-
- responsive.width(16) // Scale width
- responsive.height(16) // Scale height
- responsive.fontSize(16) // Scale font size
- responsive.fontSizeAdvanced(16) // Advanced font scaling (recommended)
- responsive.padding(16) // Scale padding
- responsive.margin(16) // Scale margin
- responsive.borderRadius(8) // Scale border radius
- responsive.iconSize(24) // Scale icon size
- responsive.lineHeight(20) // Scale line height
- responsive.getSpacing('normal') // Get predefined spacings
- responsive.getMaxContentWidth() // Get max content width for layout
- responsive.isMobile() // Check if mobile
- responsive.isTablet() // Check if tablet
- responsive.isDesktop() // Check if desktop
- responsive.isPortrait() // Check if portrait
- responsive.isLandscape() // Check if landscape
  \*/

/\*\*

- EXAMPLE: StyleSheet with Direct Methods
-
- const styles = StyleSheet.create({
- container: {
-     flex: 1,
-     padding: responsive.padding(16),
-     backgroundColor: '#fff',
- },
- card: {
-     padding: responsive.padding(12),
-     marginBottom: responsive.margin(16),
-     borderRadius: responsive.borderRadius(12),
- },
- title: {
-     fontSize: responsive.fontSizeAdvanced(20),
-     fontWeight: 'bold',
-     marginBottom: responsive.margin(8),
- },
- description: {
-     fontSize: responsive.fontSize(14),
-     lineHeight: responsive.lineHeight(20),
-     color: '#666',
- },
- });
  \*/

// ============================================================================
// REACT HOOKS API
// ============================================================================

/\*\*

- Main Hooks (Reactive to Dimension Changes)
-
- useResponsive() // Get all responsive values
- useIsMobile() // boolean - is mobile device
- useIsTablet() // boolean - is tablet device
- useIsDesktop() // boolean - is desktop device
- useDeviceType() // 'mobile' | 'tablet' | 'desktop' | 'web'
- useOrientation() // 'portrait' | 'landscape'
- useIsPortrait() // boolean - is portrait orientation
- useIsLandscape() // boolean - is landscape orientation
- useResponsiveFontSize(size) // number - scaled font size
- useSpacing(category) // number - responsive spacing
- useMaxContentWidth() // number - max width for content
- usePaddingByDevice() // number - device-appropriate padding
  \*/

/\*\*

- EXAMPLE: Conditional Rendering Based on Device Type
-
- import React from 'react';
- import { View, Text } from 'react-native';
- import { useIsMobile, useIsDesktop } from '@/utilities/responsive';
-
- export const ResponsiveLayout = () => {
- const isMobile = useIsMobile();
- const isDesktop = useIsDesktop();
-
- return (
-     <View style={{ flex: 1 }}>
-       {isMobile && (
-         <View>
-           {/* Mobile-specific layout */}
-         </View>
-       )}
-
-       {isDesktop && (
-         <View style={{ flexDirection: 'row' }}>
-           {/* Desktop layout with sidebar */}
-         </View>
-       )}
-     </View>
- );
- };
  \*/

/\*\*

- EXAMPLE: Responsive Styling with Hooks
-
- import React from 'react';
- import { View, Text, StyleSheet } from 'react-native';
- import { useResponsive } from '@/utilities/responsive';
-
- export const FluidComponent = () => {
- const { width, height, isPortrait } = useResponsive();
-
- const styles = StyleSheet.create({
-     container: {
-       padding: isPortrait ? 16 : 24,
-       width: '100%',
-     },
- });
-
- return (
-     <View style={styles.container}>
-       <Text>Dimensions: {width} x {height}</Text>
-     </View>
- );
- };
  \*/

// ============================================================================
// WEB-SPECIFIC UTILITIES
// ============================================================================

/\*\*

- Web Layout Functions (Return Values Based on Screen Width)
-
- getGridColumns(width) // Get number of grid columns
- getGridGap(width) // Get grid gap spacing
- getContainerWidth(width, fullWidth) // Get responsive container width
- getSidebarWidth(width) // Get sidebar width
- shouldShowSidebar(width) // Whether to show sidebar
- getWebFontSize(size, width) // Get fluid font size
- getResponsiveSpacing(level, width) // Get spacing based on level
- getContainerStyles(width) // Get container style object
- getGridStyles(width, columns) // Get grid style object
- getResponsiveFlexStyles(width) // Get flex layout styles
  \*/

/\*\*

- EXAMPLE: Web Grid Layout
-
- import React from 'react';
- import { ScrollView } from 'react-native';
- import {
- getGridColumns,
- getGridGap,
- useGridColumns,
- useGridGap,
- } from '@/utilities/responsive/web';
-
- export const ProductGrid = () => {
- const columns = useGridColumns();
- const gap = useGridGap();
-
- return (
-     <ScrollView
-       style={{
-         display: 'grid',
-         gridTemplateColumns: `repeat(${columns}, 1fr)`,
-         gap: gap,
-         padding: 24,
-       }}
-     >
-       {/* Grid items */}
-     </ScrollView>
- );
- };
  \*/

/\*\*

- Web Hooks
-
- useIsWeb() // boolean - is running on web platform
- useWebBreakpoint() // Get current breakpoint name
- useGridColumns() // Get responsive grid columns
- useContainerWidth() // Get responsive container width
- useShouldShowSidebar() // Should show sidebar on current screen
- useSidebarWidth() // Get sidebar width
- useGridGap() // Get responsive grid gap
  \*/

/\*\*

- EXAMPLE: Web Two-Column Layout with Sidebar
-
- import React from 'react';
- import { View } from 'react-native';
- import {
- useShouldShowSidebar,
- useSidebarWidth,
- useContainerWidth,
- } from '@/utilities/responsive/web';
-
- export const WebLayout = () => {
- const showSidebar = useShouldShowSidebar();
- const sidebarWidth = useSidebarWidth();
-
- return (
-     <View style={{ flexDirection: 'row', flex: 1 }}>
-       {showSidebar && (
-         <View style={{ width: sidebarWidth }}>
-           {/* Sidebar content */}
-         </View>
-       )}
-       <View style={{ flex: 1 }}>
-         {/* Main content */}
-       </View>
-     </View>
- );
- };
  \*/

// ============================================================================
// BEST PRACTICES
// ============================================================================

/\*\*

- 1.  ALWAYS USE fontSizeAdvanced() for font sizes
- - Better scaling algorithm
- - Prevents extreme sizes on very large/small screens
- - Includes accessibility font scaling
-
- ✓ GOOD:
-      fontSize: responsive.fontSizeAdvanced(16)
-
- ✗ AVOID:
-      fontSize: responsive.fontSize(16) // Only for simple cases
  \*/

/\*\*

- 2.  Use hooks for components that need reactive updates
- when orientation or device size changes
-
- ✓ GOOD:
-      const { width, isPortrait } = useResponsive();
-      return <View style={{ flexDirection: isPortrait ? 'column' : 'row' }} />
-
- ✗ AVOID:
-      const isPortrait = responsive.isPortrait();
-      // Won't update when orientation changes
  \*/

/\*\*

- 3.  Predefine spacing values for consistency
- Use responsive.getSpacing() for standard spacings
-
- ✓ GOOD:
-      const tightSpacing = responsive.getSpacing('tight');
-      const normalSpacing = responsive.getSpacing('normal');
-
- ✗ AVOID:
-      padding: responsive.padding(Math.random() * 100)
  \*/

/\*\*

- 4.  Use getMaxContentWidth() for web layouts
- Prevents content from being too wide on desktop screens
-
- ✓ GOOD:
-      const maxWidth = responsive.getMaxContentWidth();
-      <View style={{ maxWidth, marginHorizontal: 'auto' }} />
-
- ✗ AVOID:
-      <View style={{ width: '100%' }} /> // Can be too wide on web
  \*/

/\*\*

- 5.  Memoise computed values in hooks
- Prevents unnecessary re-renders
-
- ✓ GOOD:
-      const fontSize = useResponsiveFontSize(16); // Autom memoized
-
- ✗ AVOID:
-      const fontSize = responsive.fontSizeAdvanced(16);
-      // Recalculated on every render
  \*/

/\*\*

- 6.  Use web utilities for web-specific layouts
-
- ✓ GOOD:
-      import { useGridColumns } from '@/utilities/responsive/web';
-      const columns = useGridColumns();
-
- ✗ AVOID:
-      // Manually calculating grid columns on mobile
  \*/

/\*\*

- 7.  Platform-specific logic should be conditional
-
- ✓ GOOD:
-      if (Platform.OS === 'web') {
-        // Use web-specific utilities
-      }
-
- ✗ AVOID:
-      // Using web utilities on all platforms
  \*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/\*\*

- PATTERN 1: Responsive Component Template
-
- import React from 'react';
- import { View, Text, StyleSheet } from 'react-native';
- import { useResponsive } from '@/utilities/responsive';
- import responsive from '@/utilities/responsive';
-
- interface ResponsiveComponentProps {
- title: string;
- }
-
- export const ResponsiveComponentTemplate: React.FC<ResponsiveComponentProps> = ({
- title,
- }) => {
- const { deviceType, isPortrait } = useResponsive();
-
- const styles = StyleSheet.create({
-     container: {
-       flex: 1,
-       padding: responsive.padding(16),
-       backgroundColor: '#fff',
-     },
-     title: {
-       fontSize: responsive.fontSizeAdvanced(20),
-       fontWeight: '600',
-       marginBottom: responsive.margin(12),
-     },
-     content: {
-       flexDirection: isPortrait ? 'column' : 'row',
-       gap: responsive.padding(16),
-     },
- });
-
- return (
-     <View style={styles.container}>
-       <Text style={styles.title}>{title}</Text>
-       <View style={styles.content}>
-         {/* Content */}
-       </View>
-     </View>
- );
- };
  \*/

/\*\*

- PATTERN 2: Conditional Layout Based on Device
-
- export const AdaptiveLayout = () => {
- const isMobile = useIsMobile();
- const isDesktop = useIsDesktop();
- const { width } = useResponsive();
-
- if (isDesktop) {
-     return <DesktopLayout />;
- }
-
- if (isMobile) {
-     return <MobileLayout />;
- }
-
- return <TabletLayout />;
- };
  \*/

/\*\*

- PATTERN 3: Web Grid with Dynamic Columns
-
- export const DynamicGrid = ({ items }: { items: any[] }) => {
- const columns = useGridColumns();
- const gap = useGridGap();
-
- return (
-     <View
-       style={{
-         display: 'grid',
-         gridTemplateColumns: `repeat(${columns}, 1fr)`,
-         gap: gap,
-       }}
-     >
-       {items.map((item) => (
-         <GridItem key={item.id} item={item} />
-       ))}
-     </View>
- );
- };
  \*/

/\*\*

- PATTERN 4: Responsive Padding Based on Device
-
- export const PaddedContainer = ({ children }: { children: React.ReactNode }) => {
- const paddingByDevice = usePaddingByDevice();
-
- return (
-     <View style={{ padding: paddingByDevice }}>
-       {children}
-     </View>
- );
- };
  \*/

/\*\*

- PATTERN 5: Fluid Typography
-
- export const FluidText = ({ fontSize = 16 }: { fontSize?: number }) => {
- const scaledFontSize = useResponsiveFontSize(fontSize);
-
- return <Text style={{ fontSize: scaledFontSize }}>Responsive Text</Text>;
- };
  \*/

// ============================================================================
// ACCESSIBILITY CONSIDERATIONS
// ============================================================================

/\*\*

- The responsive utilities support accessibility features:
-
- 1.  Font Scaling:
- - Respects OS font scaling preferences
- - fontSizeAdvanced() uses logarithmic scaling
- - Prevents font sizes from becoming unusable
-
- 2.  Color Contrast:
- - Use theme colors (already handled by your store)
- - Ensure sufficient contrast on all screen sizes
-
- 3.  Touch Targets:
- - Minimum 48x48pt for interactive elements
- - Use responsive.iconSize() which respects this
-
- 4.  Screen Reader Support:
- - Responsive utilities don't affect accessibility labels
- - Always include 'accessibilityLabel' on interactive elements
    \*/

// ============================================================================
// MIGRATION GUIDE (From Old responsive to New)
// ============================================================================

/\*\*

- OLD:
- import responsive from '@/utilities/responsive';
- responsive.width(16)
- responsive.fontSize(16)
-
- NEW (Same code, but with more features):
- import responsive from '@/utilities/responsive';
- responsive.width(16)
- responsive.fontSizeAdvanced(16) // Better algorithm
-
- - Hooks available:
- import { useResponsive } from '@/utilities/responsive';
-
- - Web utilities:
- import { useGridColumns } from '@/utilities/responsive/web';
  \*/

// ============================================================================
// PERFORMANCE NOTES
// ============================================================================

/\*\*

- Performance Optimization Tips:
-
- 1.  Memoization:
- - All hooks use useMemo automatically
- - Direct method calls are non-reactive and fast
-
- 2.  Rendering:
- - Only use hooks when dimensions might change
- - Use direct method calls for static values
-
- 3.  Calculations:
- - Responsive calculations are very fast (< 1ms)
- - Cache values in useMemo if used multiple times
-
- 4.  Listener Management:
- - Dimension listener cleanup handled automatically
- - No memory leaks from orientation changes
    \*/

export {};
