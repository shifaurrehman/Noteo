import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Note } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onMove?: () => void;
  isMenuVisible?: boolean;
  onToggleMenu?: () => void;
  categoryName?: string;
  categoryColor?: string;
}

const { width } = Dimensions.get('window');

// Memoizing prevents unnecessary re-renders in long lists
export const NoteCard: React.FC<NoteCardProps> = memo(({
  note,
  onPress,
  onEdit,
  onDelete,
  onPin,
  onMove,
  isMenuVisible,
  onToggleMenu,
  categoryName,
  categoryColor
}) => {
  const { colors, typography } = useTheme();
  const isDarkMode = colors.background === "#101122";

  // Use a solid, deep background for cards in dark mode to avoid "hazy" transparency
  const cardBackgroundColor = isDarkMode ? "#15172A" : colors.cardBg;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  return (
    <View style={[styles.outerContainer, isMenuVisible && { zIndex: 100 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            borderColor: colors.settingsBorder,
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
        onPress={onPress}
        onLongPress={onToggleMenu}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <View style={[styles.dot, { backgroundColor: categoryColor || colors.primary }]} />
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {categoryName?.toUpperCase() || 'GENERAL'}
            </Text>
          </View>
          
          <Pressable 
            onPress={(e) => {
              e.stopPropagation();
              onPin?.();
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={({ pressed }) => [
              styles.pinButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Image
              source={note.isFavorite 
                ? require('@/assets/images/pin-filled.png') 
                : require('@/assets/images/pin-empty.png')
              }
              style={[
                styles.pinIcon,
                { tintColor: colors.primary }
              ]}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={styles.cardBody}>
          <Text
            style={[styles.title, { color: colors.textMain, fontSize: typography.h3 }]}
            numberOfLines={2}
          >
            {note.title || 'Untitled Note'}
          </Text>
          
          <Text 
            style={[styles.content, { color: colors.textSecondary, fontSize: typography.bodySmall }]} 
            numberOfLines={3}
          >
            {note.content || 'No additional text...'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.date, { color: colors.textSecondary, fontSize: typography.caption }]}>
            {formatDate(note.updatedAt ?? note.createdAt)}
          </Text>
        </View>
      </Pressable>

      {/* Popup Menu */}
      {isMenuVisible && (
        <View style={[
          styles.popupContainer,
          {
            backgroundColor: isDarkMode ? "#0F1121" : colors.background,
            borderColor: isDarkMode ? colors.border + "30" : colors.border + "40",
          }
        ]}>
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: pressed ? (isDarkMode ? colors.border + "15" : colors.border + "40") : "transparent" }
            ]}
            onPress={() => {
              onToggleMenu?.();
              onPin?.();
            }}
          >
            <Ionicons
              name={note.isFavorite ? "pin" : "pin-outline"}
              size={18}
              color={note.isFavorite ? colors.primary : colors.textMain}
            />
            <Text style={[styles.menuText, { color: colors.textMain }]}>
              {note.isFavorite ? "Unpin" : "Pin Note"}
            </Text>
          </Pressable>

          <View style={[styles.separator, { backgroundColor: colors.border + "20" }]} />

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: pressed ? (isDarkMode ? colors.border + "15" : colors.border + "40") : "transparent" }
            ]}
            onPress={() => {
              onToggleMenu?.();
              onMove?.();
            }}
          >
            <MaterialCommunityIcons name="folder-move-outline" size={18} color={colors.textMain} />
            <Text style={[styles.menuText, { color: colors.textMain }]}>Move Note</Text>
          </Pressable>

          <View style={[styles.separator, { backgroundColor: colors.border + "20" }]} />

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: pressed ? (isDarkMode ? colors.border + "15" : colors.border + "40") : "transparent" }
            ]}
            onPress={() => {
              onToggleMenu?.();
              onEdit?.();
            }}
          >
            <Ionicons name="create-outline" size={18} color={colors.textMain} />
            <Text style={[styles.menuText, { color: colors.textMain }]}>Edit</Text>
          </Pressable>

          <View style={[styles.separator, { backgroundColor: colors.border + "20" }]} />

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: pressed ? (isDarkMode ? colors.border + "15" : colors.border + "40") : "transparent" }
            ]}
            onPress={() => {
              onToggleMenu?.();
              onDelete?.();
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={[styles.menuText, { color: colors.danger }]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

NoteCard.displayName = 'NoteCard';

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    zIndex: 1,
  },
  card: {
    width: width - 32,
    alignSelf: 'center',
    borderRadius: 28,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#000',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pinButton: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinIcon: {
    width: 22,
    height: 22,
  },
  cardBody: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
    lineHeight: 28,
  },
  content: {
    lineHeight: 22,
    opacity: 0.7,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  popupContainer: {
    position: 'absolute',
    top: 46,
    right: 28,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    zIndex: 9999,
    width: 140,
    borderWidth: 1,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuText: {
    fontSize: 13,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    marginHorizontal: 8,
  },
});
