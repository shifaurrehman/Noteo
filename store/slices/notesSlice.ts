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
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<NoteApi> }>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    deleteNotesByCategory: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.categoryId !== action.payload);
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
} = notesSlice.actions;
export default notesSlice.reducer;
