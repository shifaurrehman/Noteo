import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../../types';

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
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.loading = false;
      state.error = null;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
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
    loadNotes: () => { },
  },
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  deleteNotesByCategory,
  setLoading,
  setError,
  loadNotes,
} = notesSlice.actions;
export default notesSlice.reducer;

