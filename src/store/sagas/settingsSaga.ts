import { call, put, takeEvery, select } from 'redux-saga/effects';
import { getData, saveData } from '../../storage/asyncStorage';
import { loadSettings } from '../slices/settingsSlice';
import { AppSettings } from '../../types';

// Load settings from storage
function* loadSettingsSaga() {
  try {
    const savedSettings: AppSettings = yield call(getData, 'appSettings');
    
    if (savedSettings) {
      yield put(loadSettings(savedSettings));
    } else {
      // Initialize with default theme (system)
      const initialSettings: AppSettings = {
        theme: 'system',
        fontSize: 'medium',
        gridDensity: 'comfortable',
        syncStatus: 'synced',
        backupEnabled: true,
      };
      
      yield put(loadSettings(initialSettings));
      yield call(saveData, 'appSettings', initialSettings);
    }
  } catch (error: any) {
    // Handle error silently or log it
    console.error('Failed to load settings:', error);
  }
}

// Save settings to storage
function* saveSettingsSaga() {
  try {
    const state: { settings: AppSettings } = yield select();
    yield call(saveData, 'appSettings', state.settings);
  } catch (error: any) {
    console.error('Failed to save settings:', error);
  }
}

// Watcher sagas
export function* watchLoadSettings() {
  yield takeEvery('settings/loadSettingsAction', loadSettingsSaga);
}

export function* watchSettingsChanges() {
  yield takeEvery(['settings/setTheme', 'settings/updateSettings'], saveSettingsSaga);
}

