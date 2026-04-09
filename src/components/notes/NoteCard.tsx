import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Platform } from 'react-native';
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
    });
  };

  return (
    <View style={[styles.outerContainer, isMenuVisible && { zIndex: 100 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            borderColor: isDarkMode ? colors.border + "22" : colors.border + "80",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          }
        ]}
        onPress={onPress}
        onLongPress={onToggleMenu}
      >
        <View style={[styles.accentBar, { backgroundColor: categoryColor || colors.primary }]} />

        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {note.isFavorite && (
                <Ionicons
                  name="pin"
                  size={14}
                  color={colors.primary}
                  style={styles.pinIcon}
                />
              )}
              <Text
                style={[styles.title, { color: colors.textMain, fontSize: typography.h3 }]}
                numberOfLines={1}
              >
                {note.title || 'Untitled Note'}
              </Text>
            </View>

            <Pressable
              onPress={onToggleMenu}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.menuButton,
                    pressed && {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.05)",
                    },
                  ]}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={18}
                    color={pressed ? colors.primary : colors.textSecondary}
                  />
                </View>
              )}
            </Pressable>
          </View>

          <Text style={[styles.content, { color: colors.textSecondary, fontSize: typography.bodySmall }]} numberOfLines={3}>
            {note.content || 'No additional text...'}
          </Text>

          <View style={[styles.footer, { borderTopColor: colors.border + "15" }]}>
            <View style={styles.metadata}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} style={styles.metaIcon} />
              <Text style={[styles.date, { color: colors.textSecondary, fontSize: typography.caption }]}>
                {`${note.updatedAt ? "Edited " : "Created "}${formatDate(note.updatedAt ?? note.createdAt)}`}
              </Text>
            </View>

            {(categoryName || note.categoryId) && (
              <View style={[styles.categoryBadge, { backgroundColor: (categoryColor || colors.primary) + '20' }]}>
                <View style={[styles.dot, { backgroundColor: categoryColor || colors.primary }]} />
                <Text style={[styles.categoryText, { color: categoryColor || colors.primary }]}>
                  {categoryName || 'General'}
                </Text>
              </View>
            )}
          </View>
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
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: '#000',
      },
      android: {
        elevation: 3,
      },
    }),
  },
  accentBar: {
    height: 2,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    marginRight: 6,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden"
  },
  content: {
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  date: {
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
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