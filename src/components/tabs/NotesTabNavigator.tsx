import { NotesListContent } from "@/components/notes/NotesListContent";
import { useTheme } from "@/hooks/useTheme";
import { Category, Note } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";
import { useResponsive } from "@/utilities/responsive";

const Tab = createMaterialTopTabNavigator();

interface NotesTabNavigatorProps {
  allNotes: Note[];
  categories: Category[];
  isLoading: boolean;
  isConnected: boolean | null;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onMove: (note: Note) => void;
  activeNoteMenuId: string | null;
  setActiveNoteMenuId: (id: string | null) => void;
  onRefresh: () => void;
}

export const NotesTabNavigator: React.FC<NotesTabNavigatorProps> = ({
  allNotes,
  categories,
  isLoading,
  isConnected,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMove,
  activeNoteMenuId,
  setActiveNoteMenuId,
  onRefresh,
}) => {
  const { colors } = useTheme();
  const { width } = useResponsive();

  const handleToggleMenu = React.useCallback(
    (id: string | null) => {
      setActiveNoteMenuId(id);
    },
    [setActiveNoteMenuId]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.background,
            borderBottomColor: "rgba(255, 255, 255, 0.05)",
            elevation: 0,
            shadowOpacity: 0,
            height: 48,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
            borderRadius: 3,
            width: 30,
            marginLeft: (width / 4 - 30) / 2,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            letterSpacing: 0.2,
            textTransform: "none",
          },
          sceneStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Tab.Screen name="All">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="all"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recent">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="recent"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Pinned">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="pinned"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Drafts">
          {() => (
            <NotesListContent
              allNotes={allNotes}
              filterType="drafts"
              categories={categories}
              isLoading={isLoading}
              isConnected={isConnected}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onMove={onMove}
              activeNoteMenuId={activeNoteMenuId}
              onToggleMenu={handleToggleMenu}
              onRefresh={onRefresh}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};
