import {
  createNoteApi,
  deleteNoteApi,
  fetchNotesApi,
  updateNoteApi,
} from "@/services/api/services/notesService";
import { SYNC_STATUS } from "@/types/category/category.types";
import { NoteApi } from "@/types/notes/notes.types";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import * as NotesActions from "../actions/notesActions";
import { loadNotes, setError, setLoading, updateNoteSyncStatus } from "../slices/notesSlice";

// Load notes from storage
export function* loadNotesSaga() {
  try {
    yield put(setLoading(true));
    const notes: NoteApi[] = yield call(fetchNotesApi);
    yield put(loadNotes(notes));
    showSuccessToast({ message: "Notes loaded successfully" });
  } catch (error: any) {
    const message = getErrorMessage(error);
    showErrorToast({ message: "failed to load notes" });
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Add note saga
export function* addNoteSaga(action: PayloadAction<NoteApi>) {
  try {
    yield put(setLoading(true));
    yield call(createNoteApi, action.payload);
    yield put(updateNoteSyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.SYNCED }));
    showSuccessToast({ message: "Note added successfully" });
  } catch (error: any) {
    const message = getErrorMessage(error);
    showErrorToast({ message: "failed to add note" });
    yield put(updateNoteSyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Update note saga
export function* updateNoteSaga(action: PayloadAction<{ id: string; updates: Partial<NoteApi> }>) {
  try {
    yield put(setLoading(true));
    yield call(updateNoteApi, action.payload.id, action.payload.updates);
    showSuccessToast({ message: "Note updated successfully" });
  } catch (error: any) {
    const message = getErrorMessage(error);
    showErrorToast({ message: "failed to update note" });
    yield put(updateNoteSyncStatus({ id: action.payload.id, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Delete note saga
export function* deleteNoteSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield call(deleteNoteApi, action.payload);
    yield put(updateNoteSyncStatus({ id: action.payload, syncStatus: SYNC_STATUS.SYNCED }));
    showSuccessToast({ message: "Note deleted successfully" });
  } catch (error: any) {
    const message = getErrorMessage(error);
    showErrorToast({ message: "failed to delete note" });
    yield put(updateNoteSyncStatus({ id: action.payload, syncStatus: SYNC_STATUS.ERROR }));
    yield put(setError(message));
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher sagas
export function* watchLoadNotes() {
  yield takeEvery(NotesActions.FETCH_NOTES_API, loadNotesSaga);
}

export function* watchAddNote() {
  yield takeEvery(NotesActions.ADD_NOTE_API, addNoteSaga);
}

export function* watchUpdateNote() {
  yield takeEvery(NotesActions.UPDATE_NOTE_API, updateNoteSaga);
}

export function* watchDeleteNote() {
  yield takeEvery(NotesActions.DELETE_NOTE_API, deleteNoteSaga);
}
