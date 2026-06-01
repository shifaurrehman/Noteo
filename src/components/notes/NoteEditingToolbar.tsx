import { useTheme } from '@/hooks/useTheme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RichToolbar, actions } from 'react-native-pell-rich-editor';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { IconPressable } from '../button/IconPressable';

interface NoteEditingToolbarProps {
  onSave: () => void;
  editorRef?: any;
  style?: StyleProp<ViewStyle>;
}

export const NoteEditingToolbar: React.FC<NoteEditingToolbarProps> = ({
  onSave,
  editorRef,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.editingBar,
      {
        backgroundColor: colors.background,
        borderTopWidth: 0.4,
        borderBottomWidth: 0.4,
        borderColor: colors.border + '30',
      },
      style
    ]}>
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
        ]}
        iconMap={{
          [actions.undo]: () => <MaterialCommunityIcons name="undo" size={22} color={colors.textSecondary} />,
          [actions.redo]: () => <MaterialCommunityIcons name="redo" size={22} color={colors.textSecondary} />,
          [actions.setBold]: ({ tintColor }: any) => <Feather name="bold" size={20} color={tintColor} />,
          [actions.setItalic]: ({ tintColor }: any) => <Feather name="italic" size={20} color={tintColor} />,
          [actions.setUnderline]: ({ tintColor }: any) => <Feather name="underline" size={20} color={tintColor} />,
        }}
        selectedIconTint={colors.primary}
        iconTint={colors.textSecondary}
        style={{ backgroundColor: 'transparent', flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}
      />

      <IconPressable onPress={onSave} size={40}>
        <Ionicons name="checkmark" size={26} color={colors.primary} />
      </IconPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  editingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    // marginHorizontal: 10,
  },
  formatActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#888',
    opacity: 0.3,
    marginHorizontal: 4,
  },
});
