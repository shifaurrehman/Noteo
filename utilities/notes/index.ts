import { CreateNewNoteParams, NoteApi } from "@/types/notes/notes.types";
import { v4 as uuidv4 } from "uuid";

export const createNewNote = ({
  title,
  content,
  categoryId,
  isFavorite = false,
}: CreateNewNoteParams): NoteApi => {
  return {
    id: uuidv4(),
    categoryId,
    title: title.trim() || "Untitled Note",
    content: content.trim(),
    isFavorite: isFavorite,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    isDeleted: false,
    version: 1,
  };
};
