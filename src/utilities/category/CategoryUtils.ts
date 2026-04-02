import { CategoryApi } from "@/types/category/category.types";
import { v4 as uuidv4 } from "uuid";

export const CreateNewCategory = ({
  name,
  color,
  icon,
  isFavorite = false,
}: {
  name: string;
  color?: string;
  icon?: string;
  isFavorite?: boolean;
}): CategoryApi => {
  return {
    id: uuidv4(),
    name: name,
    color: color,
    icon: icon,
    isFavorite: isFavorite,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    isDeleted: false,
    version: 1,
    isLocal: true,
  };
};

