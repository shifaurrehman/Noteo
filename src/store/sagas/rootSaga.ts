import { all, fork } from "redux-saga/effects";
import {
  watchLoadCategories,
  watchAddCategory,
  watchUpdateCategory,
  watchDeleteCategory,
} from "./categoriesSaga";
import { watchLoadNotes, watchAddNote, watchUpdateNote, watchDeleteNote } from "./notesSaga";
import { watchLogin, watchRegister, watchLogout, watchSyncUserData } from "./authSaga";
import { watchLoadSettings, watchSettingsChanges } from "./settingsSaga";
import { watchNetworkRestore } from "./networkSaga";

export function* rootSaga() {
  yield all([
    // Settings sagas (load first)
    fork(watchLoadSettings),
    fork(watchSettingsChanges),

    // Categories sagas
    fork(watchLoadCategories),
    fork(watchAddCategory),
    fork(watchUpdateCategory),
    fork(watchDeleteCategory),

    // Notes sagas
    fork(watchLoadNotes),
    fork(watchAddNote),
    fork(watchUpdateNote),
    fork(watchDeleteNote),

    // Auth sagas
    fork(watchLogin),
    fork(watchRegister),
    fork(watchLogout),
    fork(watchSyncUserData),

    // Network sync saga
    fork(watchNetworkRestore),
  ]);
}
