import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { IconPressable } from '../button/IconPressable';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get('window');

// Memoizing prevents unnecessary re-renders in long lists
export const NoteCard: React.FC<NoteCardProps> = memo(({ note, onPress, onDelete, onToggleFavorite }) => {
  const { colors, typography } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />

      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textMain, fontSize: typography.h3 }]} numberOfLines={1}>
            {note.title || 'Untitled Note'}
          </Text>
          
          {/* Favorite Toggle in the Top Right */}
          <IconPressable
            onPress={onToggleFavorite || (() => {})}
            size={20}
            haptic="medium"
            backgroundColor="transparent"
            pressedColor={colors.iconBgPressed}
          >
            <Ionicons 
              name={note.isFavorite ? "star" : "star-outline"} 
              size={20} 
              color={note.isFavorite ? colors.favoriteNote : colors.textSecondary} 
            />
          </IconPressable>
        </View>

        <Text style={[styles.content, { color: colors.textSecondary, fontSize: typography.bodySmall }]} numberOfLines={3}>
          {note.content || 'No additional text...'}
        </Text>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.metadata}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} style={styles.metaIcon} />
            <Text style={[styles.date, { color: colors.textSecondary, fontSize: typography.caption }]}>
              {`${note.updatedAt ? "Edited " : "Created "}${formatDate(note.updatedAt ?? note.createdAt)}`}
            </Text>
          </View>
          
          <View style={styles.footerActions}>
            {/* Delete Icon moved to footer for a cleaner look */}
            {onDelete && (
              <IconPressable
                onPress={onDelete}
                size={16}
                haptic="heavy"
                backgroundColor={colors.iconBg}
                pressedColor={colors.iconBgPressed}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </IconPressable>
            )}

            <View style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
               <Text style={[styles.tagText, { color: colors.primary, fontSize: typography.sub }]}>Note</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

NoteCard.displayName = 'NoteCard';

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  accentBar: {
    height: 4,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.5,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 5,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginRight: 10,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});