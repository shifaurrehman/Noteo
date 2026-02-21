import { SYNC_STATUS, SyncStatus } from "@/types/category/category.types";
import { Note, NoteApi } from "@/types/notes/notes.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    loadNotes: (state, action: PayloadAction<NoteApi[]>) => {
      state.notes = action.payload.map((note) => ({
        ...note,
        syncStatus: SYNC_STATUS.SYNCED,
        isLocal: false,
      }));
      state.loading = false;
      state.error = null;
    },
    addNote: (state, action: PayloadAction<NoteApi>) => {
      state.notes.push({ ...action.payload, syncStatus: SYNC_STATUS.PENDING });
    },
    updateNoteSyncStatus: (state, action: PayloadAction<{ id: string; syncStatus: SyncStatus }>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index].syncStatus = action.payload.syncStatus;
      }
    },
    markNoteAsSynced: (state, action: PayloadAction<{ id: string; isLocal?: boolean }>) => {
      const index = state.notes.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index].syncStatus = SYNC_STATUS.SYNCED;
        if (action.payload.isLocal !== undefined) {
          state.notes[index].isLocal = action.payload.isLocal;
        }
      }
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<NoteApi> }>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
          syncStatus: SYNC_STATUS.PENDING,
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        if (note.isLocal) {
          // If it's local (never synced), just remove it
          state.notes = state.notes.filter((n) => n.id !== action.payload);
        } else {
          // If it's from server, soft delete it
          const index = state.notes.findIndex((n) => n.id === action.payload);
          if (index !== -1) {
            state.notes[index].isDeleted = true;
            state.notes[index].syncStatus = SYNC_STATUS.PENDING;
          }
        }
      }
    },
    deleteNotesByCategory: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.map((note) => {
        if (note.categoryId === action.payload) {
          return { ...note, isDeleted: true, syncStatus: SYNC_STATUS.PENDING };
        }
        return note;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchNotes: () => {},
  },
});

export const {
  loadNotes,
  addNote,
  updateNote,
  deleteNote,
  deleteNotesByCategory,
  setLoading,
  setError,
  fetchNotes,
  updateNoteSyncStatus,
  markNoteAsSynced,
} = notesSlice.actions;
export default notesSlice.reducer;
