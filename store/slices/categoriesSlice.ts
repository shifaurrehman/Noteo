import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryApi, SYNC_STATUS, SyncStatus } from "@/types/category/category.types";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    loadCategories: (state, action: PayloadAction<CategoryApi[]>) => {
      state.categories = action.payload.map((cat) => ({
        ...cat,
        syncStatus: SYNC_STATUS.SYNCED,
        isLocal: false,
      }));
      state.loading = false;
      state.error = null;
    },
    fetchCategories: () => {},
    addCategory: (state, action: PayloadAction<CategoryApi>) => {
      state.categories.push({ ...action.payload, syncStatus: SYNC_STATUS.PENDING });
    },
    updateCategory: (state, action: PayloadAction<{ id: string; updates: Partial<CategoryApi> }>) => {
      const index = state.categories.findIndex((category) => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...action.payload.updates,
          syncStatus: SYNC_STATUS.PENDING,
        };
      }
    },
    updateCategorySyncStatus: (state, action: PayloadAction<{ id: string; syncStatus: SyncStatus }>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index].syncStatus = action.payload.syncStatus;
      }
    },
    markCategoryAsSynced: (state, action: PayloadAction<{ id: string; isLocal?: boolean }>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index].syncStatus = SYNC_STATUS.SYNCED;
        if (action.payload.isLocal !== undefined) {
          state.categories[index].isLocal = action.payload.isLocal;
        }
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const category = state.categories.find((c) => c.id === action.payload);
      if (category) {
        if (category.isLocal) {
          // If it's local (never synced), just remove it
          state.categories = state.categories.filter((c) => c.id !== action.payload);
        } else {
          // If it's from server, soft delete it
          const index = state.categories.findIndex((c) => c.id === action.payload);
          if (index !== -1) {
            state.categories[index].isDeleted = true;
            state.categories[index].syncStatus = SYNC_STATUS.PENDING;
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  loadCategories,
  fetchCategories,
  addCategory,
  updateCategory,
  updateCategorySyncStatus,
  markCategoryAsSynced,
  deleteCategory,
  setLoading,
  setError,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
