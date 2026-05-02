import { NoteCard } from "@/components/notes/NoteCard";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FilterTab = "all" | "recent" | "pinned" | "drafts";

interface NotesListContentProps {
  allNotes: Note[];
  filterType: FilterTab;
  categories: Category[];
  isLoading: boolean;
  isConnected: boolean | null;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onMove: (note: Note) => void;
  activeNoteMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
  onRefresh: () => void;
}

export const NotesListContent: React.FC<NotesListContentProps> = React.memo(
  ({
    allNotes,
    filterType,
    categories,
    isLoading,
    isConnected,
    onEdit,
    onDelete,
    onToggleFavorite,
    onMove,
    activeNoteMenuId,
    onToggleMenu,
    onRefresh,
  }) => {
    const { colors } = useTheme();

    const filteredNotes = useMemo(() => {
      switch (filterType) {
        case "recent": {
          const oneDayAgo = new Date();
          oneDayAgo.setDate(oneDayAgo.getDate() - 7);
          return allNotes
            .filter((n) => !n.isDeleted)
            .filter((n) => new Date(n.updatedAt ?? n.createdAt) >= oneDayAgo)
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime() -
                new Date(a.updatedAt ?? a.createdAt).getTime()
            );
        }
        case "pinned":
          return allNotes.filter((n) => !n.isDeleted && n.isFavorite);
        case "drafts":
          return allNotes.filter(
            (n) => !n.isDeleted && (!n.content?.trim() || !n.title?.trim())
          );
        default: // 'all'
          return allNotes
            .filter((n) => !n.isDeleted)
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt).getTime() -
                new Date(a.updatedAt ?? a.createdAt).getTime()
            );
      }
    }, [allNotes, filterType]);

    const renderItem = useCallback(
      ({ item }: { item: Note }) => {
        const category = categories.find((c) => c.id === item.categoryId);

        return (
          <NoteCard
            note={item}
            onPress={() => {
              onToggleMenu(null);
              onEdit(item);
            }}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            onPin={() => onToggleFavorite(item)}
            onMove={() => onMove(item)}
            isMenuVisible={activeNoteMenuId === item.id}
            onToggleMenu={() =>
              onToggleMenu(activeNoteMenuId === item.id ? null : item.id)
            }
            categoryName={category?.name}
            categoryColor={category?.color}
          />
        );
      },
      [
        categories,
        activeNoteMenuId,
        onToggleMenu,
        onEdit,
        onDelete,
        onToggleFavorite,
        onMove,
      ]
    );

    const renderEmpty = useCallback(() => {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>No notes yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start by adding a note to any category
          </Text>
        </View>
      );
    }, [colors.textMain, colors.textSecondary]);

    const refreshControl = useCallback(
      () => (
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      ),
      [isLoading, colors.primary, colors.surface, onRefresh]
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl()}
        />
      </View>
    );
  }
);

NotesListContent.displayName = "NotesListContent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
