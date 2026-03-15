import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

import { theme } from "../theme/colors";

// Theme selectors
export const selectTheme = (state: RootState) => state.theme.theme;
export const selectThemeSettings = (state: RootState) => state.theme.settings;
export const selectColors = createSelector([selectTheme], (themeMode) => {
  const activeTheme = themeMode === "dark" ? "dark" : "light";
  return theme[activeTheme].colors;
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
    const categoryNotes = notes.filter((note) => note.categoryId === categoryId && !note.isDeleted);
    return categoryNotes;
  }
);
export const selectNoteById = (state: RootState, id: string) =>
  (state.notes.notes || []).find((note) => note.id === id && !note.isDeleted);

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Network selectors
export const selectIsConnected = (state: RootState) => state.network.isConnected;
