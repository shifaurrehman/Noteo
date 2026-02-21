import { call, select, take } from "redux-saga/effects";
import { RootState } from "../store";
import { syncPendingNotesSaga } from "./syncNotesSaga";
import { syncPendingCategoriesSaga } from "./syncSaga";
import { setNetworkState } from "../slices/networkSlice";

export function* watchNetworkRestore(): Generator {
  while (true) {
    yield take(setNetworkState.type);
    const state: RootState = yield select();
    const { isConnected } = state.network;
    const { user } = state.auth;

    if (isConnected && user?.registered) {
      console.log("[Sync Saga] Network restored and user registered - triggering sync");
      yield call(syncPendingCategoriesSaga);
      yield call(syncPendingNotesSaga);
    }
  }
}
