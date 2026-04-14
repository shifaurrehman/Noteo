import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { updateSettingsApi, getSettingsApi } from '../../services/api/services/settingsService';
import { 
  syncComplete, 
  syncError, 
  loadSettings,
  updateSettings,
  setTheme,
  loadSettingsAction
} from '../slices/settingsSlice';
import { AppSettings } from '../../types';
import { selectSettings } from '../selectors';
import { showErrorToast, showSuccessToast } from '@/utilities/toast/message-toast';

function* syncSettingsSaga(action: any) {
  try {
    const currentSettings: AppSettings = yield select(selectSettings);
    const { syncStatus, ...settingsToSync } = currentSettings as any;
    const updatedSettings: AppSettings = yield call(updateSettingsApi, settingsToSync);
    yield put(syncComplete(updatedSettings));
    showSuccessToast({ message: "Settings synced successfully" });
  } catch (error: any) {
    console.error('Failed to sync settings:', error);
    yield put(syncError());
    yield call(showErrorToast, { message: "Failed to sync settings with server" });
  }
}

function* loadSettingsFromServerSaga() {
  try {
    const remoteSettings: AppSettings = yield call(getSettingsApi);
    yield put(loadSettings(remoteSettings));
    showSuccessToast({ message: "Settings loaded successfully" });
  } catch (error: any) {
    console.log('Failed to fetch remote settings, using local:', error);
    showErrorToast({ message: "Failed to load settings from server" });
  }
}

export function* watchLoadSettings() {
  yield takeLatest(loadSettingsAction, loadSettingsFromServerSaga);
}

export function* watchSettingsChanges() {
  yield takeLatest([setTheme, updateSettings], syncSettingsSaga);
}
