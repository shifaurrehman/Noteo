import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { clearStorage } from "@/utilities/auth";
import { loginUserApi, registerUserApi } from "@/services/api/services/authService";
import { tokenStorage } from "@/services/storage/tokenStorage";
import { LoginResponse, RegisterResponse } from "@/types/auth/auth.types";
import { User } from "@/types/user/user.types";
import { setError, setLastSyncAt, setLoading, setUser } from "../slices/authSlice";
import { markCategoryAsSynced } from "../slices/categoriesSlice";
import { loadSettingsAction, updateSettings } from "../slices/settingsSlice";
import { markNoteAsSynced } from "../slices/notesSlice";
import { selectCategories, selectNotes } from "../selectors";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { router } from "expo-router";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";

// Helper function to merge offline data with server account
function* mergeLocalData(serverUser: User): Generator {
  try {
    const localCategories = yield select(selectCategories);
    const localNotes = yield select(selectNotes);

    // Filter local-only items (isLocal: true)
    const guestCategories = localCategories.filter((cat: any) => cat.isLocal);
    const guestNotes = localNotes.filter((note: any) => note.isLocal);

    // Mark guest categories as ready for sync with server user ID
    for (const category of guestCategories) {
      yield put(markCategoryAsSynced({
        id: category.id,
        isLocal: false  // Mark as ready for sync to server
      }));
    }

    // Mark guest notes as ready for sync with server user ID
    for (const note of guestNotes) {
      yield put(markNoteAsSynced({
        id: note.id,
        isLocal: false  // Mark as ready for sync to server
      }));
    }

    console.log(`[Local Merge] Merged ${guestCategories.length} categories and ${guestNotes.length} notes for user ${serverUser.id}`);
  } catch (error) {
    console.error("[Local Merge] Failed to merge local data:", error);
  }
}

function* loginSaga(action: PayloadAction<{ email: string; password: string }>): Generator {
  try {
    yield put(setLoading(true));
    const response: LoginResponse = yield call(loginUserApi, action.payload);
    const user: User = { ...response.user, registered: true };
    const { accessToken, refreshToken } = response;
    // Merge any offline data the user created before logging in
    yield call(mergeLocalData, user);

    yield call(tokenStorage.saveTokens, accessToken, refreshToken);
    yield put(setUser(user));

    // Fetch user settings after successful login and auto-enable backup
    yield put(loadSettingsAction());
    yield put(updateSettings({ backupEnabled: true }));
    showSuccessToast({ message: "Logged in successfully" });
  } catch (error: any) {
    const message = getErrorMessage(error);

    if (message.toLowerCase().includes("not verified") || message.toLowerCase().includes("unverified")) {
      showErrorToast({ message: "Email not verified. Redirecting to verification..." });
      router.push(`/(auth)/verify-email?email=${encodeURIComponent(action.payload.email)}` as any);
    } else {
      showErrorToast({ message: message });
    }

    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

function* registerSaga(action: PayloadAction<{ email: string; name: string; password: string }>): Generator {
  try {
    yield put(setLoading(true));
    const response: RegisterResponse = yield call(registerUserApi, action.payload);
    console.log("Register Response:", response);
    const message = (response as any)?.message;
      router.push(`/(auth)/verify-email?email=${encodeURIComponent(action.payload.email)}` as any);
    if (response.accessToken && response.refreshToken && (response.user as any)?.isVerified !== false) {
      // Merge any offline data the user created before registering 
      yield call(mergeLocalData, response.user);

      yield call(tokenStorage.saveTokens, response.accessToken, response.refreshToken);
      yield put(setUser(response.user));

      // Fetch user settings after successful registration (auto-login) and auto-enable backup
      yield put(loadSettingsAction());
      yield put(updateSettings({ backupEnabled: true }));
      showSuccessToast({ message: "Registration successful" });
    }
  } catch (error: any) {
    const message = getErrorMessage(error) || "Failed to register";
    showErrorToast({ message: message });
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Logout saga
function* logoutSaga() {
  try {
    yield call(clearStorage);
    yield call(tokenStorage.clearTokens);
  } catch (error: any) {
    const message = error.message || "Failed to logout";
    showErrorToast({ message });
    yield put(setError(message));
  }
}

// Sync user data from backend
function* syncUserDataSaga(_action: PayloadAction<string>) {
  try {
    const lastSyncAt = new Date().toISOString();
    yield put(setLastSyncAt(lastSyncAt));
  } catch (error: any) {
    yield put(setError(error.message || "Failed to sync data"));
  }
}

// Watcher sagas
export function* watchLogin() {
  yield takeEvery("auth/loginUser", loginSaga);
}

export function* watchRegister() {
  yield takeEvery("auth/registerUser", registerSaga);
}

export function* watchLogout() {
  yield takeEvery("auth/logout", logoutSaga);
}

export function* watchSyncUserData() {
  yield takeEvery("auth/syncUserData", syncUserDataSaga);
}
