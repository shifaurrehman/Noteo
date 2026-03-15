import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, AppSettings } from '../../types';

interface ThemeState {
  theme: ThemeMode;
  settings: AppSettings;
}

export const initialState: ThemeState = {
  theme: 'system',
  settings: {
    theme: 'system',
    fontSize: 'medium',
    notifications: true,
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      state.settings.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      state.settings.theme = state.theme;
    },
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      }
    },
    loadSettings: (state, action: PayloadAction<AppSettings>) => {
      state.settings = action.payload;
      state.theme = action.payload.theme || 'light';
    },
    loadTheme: () => {
      // This action is handled by saga - no state change needed
    },
  },
});

export const { setTheme, toggleTheme, updateSettings, loadSettings, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;

