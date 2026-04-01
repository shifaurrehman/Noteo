import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@/utilities/routes/Routes';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
  onBack?: () => void;
  backgroundColor?: string;
  borderColor?: string;
  titleStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showSettings = false,
  onBack,
  backgroundColor,
  borderColor,
  titleStyle,
  leftIcon,
  rightIcon,
  containerStyle,
}) => {
  const { colors, typography } = useTheme();
  const { openSettings } = useNavigation()

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: borderColor || colors.border,
    },
    title: {
      fontSize: typography.h1,
      fontWeight: 'bold',
      color: colors.textMain,
      flex: 1,
      textAlign: 'center',
    },
    icon: {
      padding: 4,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || colors.headerBg }, containerStyle]}>
      {/* Left Icon */}
      {onBack && (
        <TouchableOpacity style={styles.icon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onBack}>
          {leftIcon || <Ionicons name="arrow-back" size={24} color={colors.textMain} />}
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Icon */}
      {showSettings && (
        <TouchableOpacity
          style={styles.icon}
          onPress={openSettings}
        >
          {rightIcon || <Ionicons name="settings-outline" size={24} color={colors.textMain} />}
        </TouchableOpacity>
      )}
    </View>
  );
};
