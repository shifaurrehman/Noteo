import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { setError, setLastSyncAt, setLoading, setToken, setUser, User } from "../slices/authSlice";
import { loginUserApi, registerUserApi } from "../api/authApi";
import { clearStorage } from "@/utilities/auth";

// Login saga (will be extended with API call)
function* loginSaga(action: PayloadAction<{ email: string; password: string }>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    const user: User = yield call(loginUserApi, action.payload);

    const token = "token_" + user.id;
    yield put(setUser(user));
    yield put(setToken(token));
  } catch (error: any) {
    yield put(setError(error.message || "Failed to login"));
  } finally {
    yield put(setLoading(false));
  }
}

// Register/Create user saga
function* registerSaga(action: PayloadAction<{ email: string; name: string; password: string }>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const newUser: User = yield call(registerUserApi, action.payload);
    const token = "token_" + newUser.id;
    yield put(setUser(newUser));
    yield put(setToken(token));
  } catch (error: any) {
    yield put(setError(error.message || "Failed to register"));
  } finally {
    yield put(setLoading(false));
  }
}

// Logout saga
function* logoutSaga() {
  try {
    // 1. Clear Redux reducers
    yield call(clearStorage) // clears AsyncStorage completely
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
