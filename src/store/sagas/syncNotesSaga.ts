import { syncNotesApi } from "@/services/api/services/notesService";
import { SYNC_STATUS } from "@/types/category/category.types";
import { Note, NoteApi } from "@/types/notes/notes.types";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { call, put, select } from "redux-saga/effects";
import { v4 as uuidv4 } from "uuid";
import { deleteNote, markNoteAsSynced, updateNote, updateNoteSyncStatus } from "../slices/notesSlice";
import { RootState } from "../store";

export function* syncPendingNotesSaga() {
  try {
    console.log("[Sync Saga] Starting smart sync of notes...");

    // 1. Check settings first
    const state: RootState = yield select();
    const settings = state.settings;
    if (!settings.backupEnabled) {
      console.log("[Sync Saga] Backup disabled locally, aborting sync.");
      return;
    }

    // 2. Combine PENDING + ERROR notes from Redux
    const notes: Note[] = state.notes.notes;
    const notesToSync = notes.filter(
      (note: Note) => note.syncStatus === SYNC_STATUS.PENDING || note.syncStatus === SYNC_STATUS.ERROR
    );

    if (notesToSync.length === 0) {
      console.log("[Sync Saga] No notes to sync");
      return;
    }

    console.log(`[Sync Saga] Found ${notesToSync.length} notes to validate and sync`);

    const validNotes: Note[] = [];

    // 2 & 3. Validate required fields and auto-fill or mark as ERROR
    for (const note of notesToSync) {
      let currentNote = { ...note };
      let isRecoverable = true;

      // Validate/Auto-fill ID (required)
      if (!currentNote.id || currentNote.id.trim() === "") {
        if (currentNote.isLocal) {
          const newId = uuidv4();
          console.log(`[Sync Saga] Auto-filling missing ID for local note: ${newId}`);
          yield put(updateNote({ id: note.id, updates: { id: newId } }));
          currentNote.id = newId;
        } else {
          console.error(`[Sync Saga] Note ${note.id} is missing ID and is not local.`);
          isRecoverable = false;
        }
      }

      // Validate Title (required)
      if (!currentNote.title || currentNote.title.trim() === "") {
        console.error(`[Sync Saga] Note ${note.id} is missing required field: title`);
        isRecoverable = false;
      }

      // Validate Content (required)
      if (!currentNote.content || currentNote.content.trim() === "") {
        console.error(`[Sync Saga] Note ${note.id} is missing required field: content`);
        isRecoverable = false;
      }

      // Validate CategoryId (required)
      if (!currentNote.categoryId || currentNote.categoryId.trim() === "") {
        console.error(`[Sync Saga] Note ${note.id} is missing required field: categoryId`);
        isRecoverable = false;
      }

      if (isRecoverable) {
        validNotes.push(currentNote);
      } else {
        console.warn(`[Sync Saga] Note ${note.id} is irrecoverable. Marking as ERROR.`);
        yield put(updateNoteSyncStatus({ id: note.id, syncStatus: SYNC_STATUS.ERROR }));
      }
    }

    if (validNotes.length === 0) {
      console.log("[Sync Saga] No valid notes to sync after validation");
      return;
    }

    // 4. Prepare batch payload
    const created: NoteApi[] = [];
    const updated: NoteApi[] = [];
    const deleted: { id: string; version: number }[] = [];

    for (const note of validNotes) {
      if (note.isDeleted) {
        if (note.isLocal) {
          // If it was never synced, just delete it locally
          yield put(deleteNote(note.id));
        } else {
          deleted.push({ id: note.id, version: note.version });
        }
      } else if (note.isLocal) {
        created.push(note);
      } else {
        updated.push(note);
      }
    }

    // If there's nothing to sync to server
    if (created.length === 0 && updated.length === 0 && deleted.length === 0) {
      return;
    }

    // 5. Call batch sync API
    try {
      yield call(syncNotesApi, { created, updated, deleted });
      console.log(
        `[Sync Saga] Successfully synced: ${created.length} created, ${updated.length} updated, ${deleted.length} deleted`
      );

      // Mark items as SYNCED
      for (const note of created) {
        yield put(markNoteAsSynced({ id: note.id, isLocal: false }));
      }
      for (const note of updated) {
        yield put(markNoteAsSynced({ id: note.id }));
      }
      for (const item of deleted) {
        yield put(markNoteAsSynced({ id: item.id }));
      }

      showSuccessToast({ message: "Notes synced successfully" });
    } catch (error: any) {
      console.error("[Sync Saga] Batch sync failed:", error);
      showErrorToast({ message: "Failed to sync notes with server" });

      // 5c. Mark all items in the failed batch as ERROR
      for (const note of created)
        yield put(updateNoteSyncStatus({ id: note.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const note of updated)
        yield put(updateNoteSyncStatus({ id: note.id, syncStatus: SYNC_STATUS.ERROR }));
      for (const item of deleted)
        yield put(updateNoteSyncStatus({ id: item.id, syncStatus: SYNC_STATUS.ERROR }));
    }
  } catch (error: any) {
    console.error("[Sync Saga] Unexpected error in syncPendingNotesSaga:", error);
    showErrorToast({ message: "An unexpected error occurred during sync" });
  }
}
