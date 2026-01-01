// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useAppSelector } from '@/store/hooks';
// import { selectColors } from '@/store/selectors';

// interface HeaderProps {
//   title: string;
//   showSettings?: boolean;
//   onBack?: () => void;
// }

// export default function Header({ title, showSettings = true, onBack }: HeaderProps) {
//   const colors = useAppSelector(selectColors);

//   const styles = StyleSheet.create({
//     container: {
//       padding: 15,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: colors.headerBg,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border,
//     },
//     title: {
//       fontSize: 22,
//       fontWeight: 'bold',
//       color: colors.text,
//       flex: 1,
//     },
//     icon: {
//       paddingRight: 14,
//     },
//   });

//   return (
//     <View style={styles.container}>
//       {onBack && (
//         <TouchableOpacity style={styles.icon} onPress={onBack}>
//           <Ionicons name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//       )}
//       <Text style={styles.title}>{title}</Text>
//       {showSettings && (
//         <TouchableOpacity
//           style={styles.icon}
//           onPress={() => router.push('/settings')}
//         >
//           <Ionicons name="settings-outline" size={24} color={colors.text} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }



import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { selectColors } from '@/store/selectors';

interface HeaderProps {
  title: string;
  showSettings?: boolean;           // show settings button
  onBack?: () => void;              // optional back button handler
  backgroundColor?: string;         // optional header bg color
  borderColor?: string;             // optional border bottom color
  titleStyle?: TextStyle;           // override title style
  leftIcon?: React.ReactNode;       // optional custom left icon
  rightIcon?: React.ReactNode;      // optional custom right icon
  containerStyle?: ViewStyle;       // override container style
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
          onPress={() => router.push('/settings')}
        >
          {rightIcon || <Ionicons name="settings-outline" size={24} color={colors.text} />}
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} />
      )}
    </View>
  );
};
