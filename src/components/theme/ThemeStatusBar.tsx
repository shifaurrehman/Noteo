import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export const ThemeStatusBar: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={colors.headerBg}
      
    />
  );
};

