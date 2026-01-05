import { Note } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const createNewNote = (
  title: string,
  content: string,
  categoryId: string,
  userId: string,
  isFavorite?: boolean
): Note => {
  
  return {
    id: uuidv4(),
    categoryId,
    userId,
    title: title.trim() || "Untitled Note",
    content: content.trim(),
    isFavorite: isFavorite ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    isDeleted: false,
    syncStatus: "pending",
    version: 0,
  };
};
