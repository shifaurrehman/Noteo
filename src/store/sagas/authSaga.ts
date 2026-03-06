import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { clearStorage } from "@/utilities/auth";
import { loginUserApi, registerUserApi } from "@/services/api/services/authService";
import { tokenStorage } from "@/services/storage/tokenStorage";
import { LoginResponse, RegisterResponse } from "@/types/auth/auth.types";
import { User } from "@/types/user/user.types";
import { setError, setLastSyncAt, setLoading, setUser } from "../slices/authSlice";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { router } from "expo-router";
import { showErrorToast } from "@/utilities/toast/message-toast";

function* loginSaga(action: PayloadAction<{ email: string; password: string }>) {
  try {
    yield put(setLoading(true));
    const response: LoginResponse = yield call(loginUserApi, action.payload);
    const user: User = { ...response.user, registered: true };
    const { accessToken, refreshToken } = response;
    yield call(tokenStorage.saveTokens, accessToken, refreshToken);
    yield put(setUser(user));
  } catch (error: any) {
    const message = getErrorMessage(error);

    if (message.toLowerCase().includes("not verified") || message.toLowerCase().includes("unverified")) {
      showErrorToast({ message: "Email not verified. Redirecting to verification..." });
      router.push(`/auth/verify-email?email=${encodeURIComponent(action.payload.email)}` as any);
    } else {
      showErrorToast({ message: message });
    }

    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

function* registerSaga(action: PayloadAction<{ email: string; name: string; password: string }>) {
  try {
    yield put(setLoading(true));
    const response: RegisterResponse = yield call(registerUserApi, action.payload);
    if (response.accessToken && response.refreshToken && (response.user as any)?.isVerified !== false) {
      yield call(tokenStorage.saveTokens, response.accessToken, response.refreshToken);
      yield put(setUser(response.user));
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
    yield put(setError(error.message || "Failed to logout"));
  }
}

// Sync user data from backend
function* syncUserDataSaga(action: PayloadAction<string>) {
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
