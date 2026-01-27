import { CategoryApi } from "@/types/category/category.types";
import { v4 as uuidv4 } from "uuid";

export const CreateNewCategory = ({name, isFavorite = false}: {name: string, isFavorite?: boolean}): CategoryApi => {
  return {
    id: uuidv4(),
    name: name,
    isFavorite: isFavorite,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    isDeleted: false,
    version: 1,
  };
};