import { Note } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const createNewNote = (
  title: string,
  content: string,
  categoryId: string,
  userId: string
): Note => {
  
  return {
    id: uuidv4(),
    categoryId,
    userId,
    title: title.trim() || "Untitled Note",
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
