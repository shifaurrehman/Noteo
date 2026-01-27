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
        state.categories[index] = { ...state.categories[index], ...action.payload.updates };
      }
    },
    updateCategorySyncStatus: (state, action: PayloadAction<{ id: string; syncStatus: SyncStatus }>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index].syncStatus = action.payload.syncStatus;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
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
  deleteCategory,
  setLoading,
  setError,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
