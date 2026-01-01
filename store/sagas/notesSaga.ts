import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { Note } from "../../types";
import { setError, setLoading, setNotes } from "../slices/notesSlice";
import { createNoteApi, deleteNoteApi, fetchNotesApi, updateNoteApi } from "../api/notesApi";

// Load notes from storage
function* loadNotesSaga() {
  try {
    yield put(setLoading(true));
    const notes: Note[] = yield call(fetchNotesApi);
    yield put(setNotes(notes));
  } catch (error: any) {
    yield put(setError(error.message || "Failed to load notes"));
  } finally {
    yield put(setLoading(false));
  }
}

// Add note saga
function* addNoteSaga(action: PayloadAction<Note>) {
  try {
    yield put(setLoading(true));
    yield call(createNoteApi, action.payload);
  } catch (error: any) {
    yield put(setError(error.message || "Failed to add note"));
  } finally {
    yield put(setLoading(false));
  }
}

// Update note saga
function* updateNoteSaga(action: PayloadAction<{ id: string; updates: Partial<Note> }>) {
  try {
    yield put(setLoading(true));
    yield call(updateNoteApi, action.payload.id, action.payload.updates);
  } catch (error: any) {
    yield put(setError(error.message || "Failed to update note"));
  } finally {
    yield put(setLoading(false));
  }
}

// Delete note saga
function* deleteNoteSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield call(deleteNoteApi, action.payload);
  } catch (error: any) {
    yield put(setError(error.message || "Failed to delete note"));
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher sagas
export function* watchLoadNotes() {
  yield takeEvery("notes/loadNotes", loadNotesSaga);
}

export function* watchAddNote() {
  yield takeEvery("notes/addNote", addNoteSaga);
}

export function* watchUpdateNote() {
  yield takeEvery("notes/updateNote", updateNoteSaga);
}

export function* watchDeleteNote() {
  yield takeEvery("notes/deleteNote", deleteNoteSaga);
}
