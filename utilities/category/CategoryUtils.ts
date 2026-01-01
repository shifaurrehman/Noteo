import { Category } from "@/types/category";
import { v4 as uuidv4 } from "uuid";

export const CreateNewCategory = (name: string, userId: string, isFavorite?: boolean): Category => {
  return {
    id: uuidv4(),
    userId: userId,
    name: name,
    isFavorite: isFavorite ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    syncStatus: "pending",
    version: 0,
  };
};