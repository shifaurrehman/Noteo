import { Note } from "@/types/notes/notes.types";
import { BASE_URL } from "@/utilities";

export const fetchNotesApi = async (): Promise<Note[]> => {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNoteApi = async (note: Note): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

export const updateNoteApi = async (
  id: string,
  updates: Partial<Note>
): Promise<Note> => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PATCH", // PATCH is better for partial updates
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
};

export const deleteNoteApi = async (id: string): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return true;
};
