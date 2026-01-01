import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/types';
import { useAppSelector } from '@/store/hooks';
import { selectColors } from '@/store/selectors';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onDelete,
}) => {
  const colors = useAppSelector(selectColors);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const styles = StyleSheet.create({
    card: {
      width:"100%",
      height:170,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      overflow:"hidden",
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    deleteButton: {
      padding: 5,
      marginLeft: 8,
      backgroundColor:"#9694942e",
      borderRadius: 24,
    },
    content: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    dateContainer:{
      width: "100%",
      flexDirection:"row",
      justifyContent:"space-between",
    },
    dateItem:{
      backgroundColor:"#96949458",
      paddingHorizontal: 8,
      paddingVertical:2,
      borderRadius: 18,
    },
    date: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    dummyIndicator: {
      fontSize: 12,
      color: colors.warning,
      fontStyle: 'italic',
      marginTop: 4,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.content} numberOfLines={4}>
        {note.content}
      </Text>
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
        <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
        </View>
        <View style={styles.dateItem}>
        <Text style={styles.date}>{`Updated at : `+formatDate(note.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

