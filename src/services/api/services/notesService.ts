import { Note, NoteApi } from "@/types/notes/notes.types";
import api from "../config/api";
import { API_ENDPOINTS } from "../config/endpoints";

export const fetchNotesApi = async (): Promise<Note[]> => {
  const res = await api.get(API_ENDPOINTS.notes.getAll);
  return res.data;
};

export const createNoteApi = async (note: NoteApi): Promise<Note> => {
  const res = await api.post(API_ENDPOINTS.notes.create, note);
  return res.data;
};

export const updateNoteApi = async (id: string, updates: Partial<NoteApi>): Promise<Note> => {
  const res = await api.patch(API_ENDPOINTS.notes.update(id), updates);
  return res.data;
};

export const deleteNoteApi = async (id: string): Promise<boolean> => {
  const res = await api.delete(API_ENDPOINTS.notes.delete(id));
  return res.data;
};

export const syncNotesApi = async (payload: {
  created: NoteApi[];
  updated: NoteApi[];
  deleted: { id: string; version: number }[];
}) => {
  const res = await api.post(API_ENDPOINTS.sync.notes, payload);
  return res.data;
};
