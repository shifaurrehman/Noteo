// UI Actions
export const ADD_NOTE = "notes/addNote";
export const UPDATE_NOTE = "notes/updateNote";
export const DELETE_NOTE = "notes/deleteNote";
export const FETCH_NOTES = "notes/fetchNotes";

// Shadow Actions for Sagas
export const ADD_NOTE_API = "notes/addNote_API";
export const UPDATE_NOTE_API = "notes/updateNote_API";
export const DELETE_NOTE_API = "notes/deleteNote_API";
export const FETCH_NOTES_API = "notes/fetchNotes_API";

// Map UI actions to Shadow Actions
export const NOTES_API_MAP: Record<string, string> = {
  [ADD_NOTE]: ADD_NOTE_API,
  [UPDATE_NOTE]: UPDATE_NOTE_API,
  [DELETE_NOTE]: DELETE_NOTE_API,
  [FETCH_NOTES]: FETCH_NOTES_API,
};
