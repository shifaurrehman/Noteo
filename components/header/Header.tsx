import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectColors } from '@/store/selectors';
import { useNavigation } from '@/utilities/routes/Routes';

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
  showSettings = true,
  onBack,
  backgroundColor,
  borderColor,
  titleStyle,
  leftIcon,
  rightIcon,
  containerStyle,
}) => {
  const colors = useAppSelector(selectColors);
  const { openSettings } = useNavigation()

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: backgroundColor || colors.headerBg,
      borderBottomWidth: 1,
      borderBottomColor: borderColor || colors.border,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    icon: {
      padding: 4,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Left Icon */}
      {onBack ? (
        <TouchableOpacity style={styles.icon} onPress={onBack}>
          {leftIcon || <Ionicons name="arrow-back" size={24} color={colors.text} />}
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} />
      )}

      {/* Title */}
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Icon */}
      {showSettings ? (
        <TouchableOpacity
          style={styles.icon}
          onPress={openSettings}
        >
          {rightIcon || <Ionicons name="settings-outline" size={24} color={colors.text} />}
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} />
      )}
    </View>
  );
};
