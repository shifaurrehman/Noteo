import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Theme selectors
export const selectTheme = (state: RootState) => state.theme.theme;
export const selectThemeSettings = (state: RootState) => state.theme.settings;
export const selectColors = createSelector([selectTheme], (theme) => {
  const Colors = {
    light: {
      primary: "#ff008c",
      primaryPressed: "#ff008cb0",
      secondary: "#bebcbcff",
      background: "#F2F2F7",
      surface: "#FFFFFF",
      text: "#000000",
      textSecondary: "#666666",
      border: "#E5E5EA",
      error: "#FF3B30",
      success: "#34C759",
      warning: "#FF9500",
      headerBg: "#FFFFFF",
      cardBg: "#FFFFFF",
      shadow: "#000000",
      delete: "red",
      iconBg: "rgba(0, 0, 0, 0.05)",
      iconBgPressed: "rgba(59, 61, 62, 0.15)",
      iconBgDanger: "rgba(40, 37, 37, 0.15)",
      disabled: "#ccc",
      favoriteNote: "#FFD700",
    },
    dark: {
      primary: "#ff008c",
      primaryPressed: "#ff008cb0",
      secondary: "#474545ff",
      background: "#000000",
      surface: "#1C1C1E",
      text: "#FFFFFF",
      textSecondary: "#98989D",
      border: "#38383A",
      error: "#FF453A",
      success: "#32D74B",
      warning: "#FF9F0A",
      headerBg: "#1C1C1E",
      cardBg: "#2C2C2E",
      shadow: "#000000",
      delete: "red",
      iconBg: "rgba(255, 255, 255, 0.08)",
      iconBgPressed: "rgba(59, 61, 62, 0.15)",
      iconBgDanger: "rgba(255, 69, 58, 0.25)",
      disabled: "#ccc",
      favoriteNote: "#FFD700",
    },
  };

  return theme === "light" ? Colors.light : Colors.dark;
});

// Categories selectors
export const selectCategories = (state: RootState) => state.categories.categories || [];
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategoriesError = (state: RootState) => state.categories.error;
export const selectCategoryById = (state: RootState, id: string) =>
  (state.categories.categories || []).find((cat) => cat.id === id);

// Notes selectors
export const selectNotes = (state: RootState) => state.notes.notes || [];
export const selectNotesLoading = (state: RootState) => state.notes.loading;
export const selectNotesError = (state: RootState) => state.notes.error;
export const selectNotesByCategory = createSelector(
  [selectNotes, (state: RootState, categoryId: string) => categoryId],
  (notes, categoryId) => {
    const categoryNotes = notes.filter((note) => note.categoryId === categoryId);
    return categoryNotes;
  }
);
export const selectNoteById = (state: RootState, id: string) =>
  (state.notes.notes || []).find((note) => note.id === id);

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
