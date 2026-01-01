import React from 'react';
import { StatusBar } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { selectColors, selectTheme } from '../../store/selectors';

export const ThemeStatusBar: React.FC = () => {
  const theme = useAppSelector(selectTheme);
  const colors = useAppSelector(selectColors);

  return (
    <StatusBar
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={colors.headerBg}
      
    />
  );
};

