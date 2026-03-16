import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, AppSettings } from '../../types';

export const initialState: AppSettings = {
  theme: 'system',
  fontSize: 'medium',
  gridDensity: 'comfortable',
  syncStatus: 'synced',
  backupEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      return { ...state, ...action.payload };
    },
    loadSettings: (state, action: PayloadAction<AppSettings>) => {
      return action.payload;
    },
    loadSettingsAction: () => {
      // This action is handled by saga - no state change needed
    },
  },
});

export const { setTheme, toggleTheme, updateSettings, loadSettings, loadSettingsAction } = settingsSlice.actions;
export default settingsSlice.reducer;

