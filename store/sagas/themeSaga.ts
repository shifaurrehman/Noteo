import { call, put, takeEvery, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { getData, saveData } from '../../storage/asyncStorage';
import { loadSettings } from '../slices/themeSlice';
import { AppSettings } from '../../types';

// Load theme settings from storage
function* loadThemeSaga() {
  try {
    const savedSettings: AppSettings = yield call(getData, 'appSettings');
    
    if (savedSettings) {
      yield put(loadSettings(savedSettings));
    } else {
      // Initialize with default theme (light)
      // System theme detection will be handled in the component layer
      const initialSettings: AppSettings = {
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
      };
      
      yield put(loadSettings(initialSettings));
      yield call(saveData, 'appSettings', initialSettings);
    }
  } catch (error: any) {
    // Handle error silently or log it
    console.error('Failed to load theme settings:', error);
  }
}

// Save theme settings to storage
function* saveThemeSaga() {
  try {
    const state: { theme: { settings: AppSettings } } = yield select();
    yield call(saveData, 'appSettings', state.theme.settings);
  } catch (error: any) {
    console.error('Failed to save theme settings:', error);
  }
}

// Watcher sagas
export function* watchLoadTheme() {
  yield takeEvery('theme/loadTheme', loadThemeSaga);
}

export function* watchThemeChanges() {
  yield takeEvery(['theme/setTheme', 'theme/updateSettings'], saveThemeSaga);
}

