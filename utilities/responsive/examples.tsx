/**
 * Example Components Using Responsive Utilities
 *
 * Copy these patterns to your own components for consistent responsive behavior
 */

import responsive, {
    useIsMobile,
    useMaxContentWidth,
    usePaddingByDevice,
    useResponsive,
    useResponsiveFontSize
} from "@/utilities/responsive";
import {
    useContainerWidth,
    useGridColumns,
    useGridGap
} from "@/utilities/responsive/web";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

// ============================================================================
// EXAMPLE 1: Basic Responsive Card Component
// ============================================================================

interface CardProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export const ResponsiveCard: React.FC<CardProps> = ({ title, description, onPress }) => {
  const { isPortrait } = useResponsive();
  const fontSizeTitle = useResponsiveFontSize(18);
  const fontSizeDesc = useResponsiveFontSize(14);

  const styles = StyleSheet.create({
    container: {
      padding: responsive.padding(16),
      marginBottom: responsive.margin(12),
      borderRadius: responsive.borderRadius(12),
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: fontSizeTitle,
      fontWeight: "600",
      marginBottom: responsive.margin(8),
      color: "#000",
    },
    description: {
      fontSize: fontSizeDesc,
      color: "#666",
      lineHeight: responsive.lineHeight(20),
    },
  });

  return (
    <View style={styles.container} onTouchEnd={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

// ============================================================================
// EXAMPLE 2: Adaptive Two-Column Layout (Web & Tablet)
// ============================================================================

interface GridItem {
  id: string;
  title: string;
  content: string;
}

interface AdaptiveGridProps {
  items: GridItem[];
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({ items }) => {
  const isMobile = useIsMobile();
  const columns = useGridColumns();
  const gap = useGridGap();

  const styles = StyleSheet.create({
    container: {
      padding: responsive.padding(16),
    },
    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap,
    } as any,
    gridMobile: {
      flexDirection: "column",
      gap: gap,
    },
  });

  if (isMobile) {
    return (
      <ScrollView style={styles.container}>
        {items.map((item) => (
          <ResponsiveCard key={item.id} title={item.title} description={item.content} />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => (
          <ResponsiveCard key={item.id} title={item.title} description={item.content} />
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 3: Responsive Header Component
// ============================================================================

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}) => {
  const isMobile = useIsMobile();
  const { isPortrait } = useResponsive();
  const titleFontSize = useResponsiveFontSize(isMobile ? 20 : 28);
  const subtitleFontSize = useResponsiveFontSize(14);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: responsive.padding(isMobile ? 12 : 16),
      paddingHorizontal: responsive.padding(16),
      backgroundColor: "#f5f5f5",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
      marginLeft: showBackButton ? responsive.margin(12) : 0,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: "bold",
      color: "#000",
      marginBottom: subtitle ? responsive.margin(4) : 0,
    },
    subtitle: {
      fontSize: subtitleFontSize,
      color: "#666",
    },
    backButton: {
      padding: responsive.padding(8),
      marginRight: responsive.margin(8),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBackButton && (
          <View style={styles.backButton} onTouchEnd={onBackPress}>
            {/* Back icon here - you can use @expo/vector-icons */}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 4: Responsive Form Input
// ============================================================================

interface ResponsiveInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

export const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
}) => {
  const fontSizeInput = useResponsiveFontSize(16);
  const paddingInput = usePaddingByDevice();

  const styles = StyleSheet.create({
    input: {
      fontSize: fontSizeInput,
      padding: paddingInput,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: responsive.borderRadius(8),
      marginVertical: responsive.margin(8),
      backgroundColor: "#fff",
    },
  });

  return (
    <Text
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      placeholderTextColor="#999"
    />
  );
};

// ============================================================================
// EXAMPLE 5: Web-Specific Responsive Container (Desktop Layout)
// ============================================================================

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, maxWidth = true }) => {
  const maxContentWidth = useMaxContentWidth();
  const containerWidth = useContainerWidth();

  const styles = StyleSheet.create({
    container: {
      width: maxWidth ? maxContentWidth : containerWidth,
      marginHorizontal: "auto" as any,
      paddingHorizontal: responsive.padding(16),
    },
  });

  if (Platform.OS !== "web") {
    return <View>{children}</View>;
  }

  return <View style={styles.container}>{children}</View>;
};

// ============================================================================
// EXAMPLE 6: Orientation-Aware Layout
// ============================================================================

interface OrientationLayoutProps {
  title: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const OrientationLayout: React.FC<OrientationLayoutProps> = ({ title, leftContent, rightContent }) => {
  const { isPortrait, isLandscape } = useResponsive();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: responsive.padding(16),
    },
    title: {
      fontSize: responsive.fontSizeAdvanced(20),
      fontWeight: "bold",
      marginBottom: responsive.margin(16),
    },
    content: {
      flex: 1,
      flexDirection: isPortrait ? "column" : "row",
      gap: responsive.padding(16),
    },
    section: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        <View style={styles.section}>{leftContent}</View>
        <View style={styles.section}>{rightContent}</View>
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 7: Responsive List with Device-Specific Rendering
// ============================================================================

interface ListItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const ResponsiveListItem: React.FC<ListItemProps> = ({ title, description, icon }) => {
  const isMobile = useIsMobile();
  const iconSize = responsive.iconSize(isMobile ? 24 : 32);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: responsive.padding(isMobile ? 12 : 16),
      marginVertical: responsive.margin(8),
      backgroundColor: "#fff",
      borderRadius: responsive.borderRadius(8),
      alignItems: "center",
    },
    icon: {
      width: iconSize,
      height: iconSize,
      marginRight: responsive.margin(12),
    },
    textContent: {
      flex: 1,
    },
    title: {
      fontSize: responsive.fontSizeAdvanced(16),
      fontWeight: "500",
      marginBottom: responsive.margin(4),
    },
    description: {
      fontSize: responsive.fontSizeAdvanced(14),
      color: "#666",
    },
  });

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.textContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 8: Responsive Modal/Dialog
// ============================================================================

interface ResponsiveModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({ title, visible, onClose, children }) => {
  const isMobile = useIsMobile();
  const { width } = useResponsive();

  const modalWidth = isMobile ? width * 0.9 : Math.min(500, width * 0.5);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      width: modalWidth,
      backgroundColor: "#fff",
      borderRadius: responsive.borderRadius(16),
      padding: responsive.padding(24),
      maxHeight: "80%",
    },
    title: {
      fontSize: responsive.fontSizeAdvanced(20),
      fontWeight: "bold",
      marginBottom: responsive.margin(16),
    },
    closeButton: {
      position: "absolute" as const,
      right: responsive.padding(12),
      top: responsive.padding(12),
      width: responsive.iconSize(32),
      height: responsive.iconSize(32),
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay} onTouchEnd={onClose}>
      <View style={styles.modal} onTouchEnd={(e) => e.stopPropagation()}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.closeButton} onTouchEnd={onClose}>
          {/* Close icon */}
        </View>
        {children}
      </View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 9: Dashboard Layout with Sidebar (Web)
// ============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const showSidebar = isMobile ? false : true;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
    },
    sidebar: {
      width: responsive.width(250),
      backgroundColor: "#2c3e50",
      paddingVertical: responsive.padding(20),
      paddingHorizontal: responsive.padding(16),
      // Sidebar content styles here
    },
    main: {
      flex: 1,
      backgroundColor: "#ecf0f1",
    },
  });

  return (
    <View style={styles.container}>
      {showSidebar && <View style={styles.sidebar}>{/* Sidebar items */}</View>}
      <View style={styles.main}>{children}</View>
    </View>
  );
};

// ============================================================================
// EXAMPLE 10: Responsive Button Component
// ============================================================================

interface ResponsiveButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) => {
  const isMobile = useIsMobile();
  const buttonHeight = isMobile ? responsive.height(44) : responsive.height(48);
  const fontSize = responsive.fontSizeAdvanced(16);

  const styles = StyleSheet.create({
    button: {
      height: buttonHeight,
      paddingHorizontal: responsive.padding(24),
      borderRadius: responsive.borderRadius(8),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: variant === "primary" ? "#007AFF" : "#f0f0f0",
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      fontSize: fontSize,
      fontWeight: "600",
      color: variant === "primary" ? "#fff" : "#000",
    },
  });

  return (
    <View style={styles.button} onTouchEnd={disabled ? undefined : onPress}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
