import { Note } from "@/types/notes/notes.types";
import axios from "axios";
import { BASE_URL } from "../config/api.config";

export const fetchNotesApi = async (): Promise<Note[]> => {
  const res = await axios.get(`${BASE_URL}/notes`);
  return res.data;
};

export const createNoteApi = async (note: Note): Promise<Note> => {
  const res = await axios.post(`${BASE_URL}/notes`, note);
  return res.data;
};

export const updateNoteApi = async (id: string, updates: Partial<Note>): Promise<Note> => {
  const res = await axios.patch(`${BASE_URL}/notes/${id}`, updates);
  return res.data;
};

export const deleteNoteApi = async (id: string): Promise<boolean> => {
  const res = await axios.delete(`${BASE_URL}/notes/${id}`);
  return res.data;
};
