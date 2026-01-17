import { Category } from "@/types/category/category.types";
import api from "../config/api";

// Get all categories
export const fetchCategoriesApi = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};


export const createCategoryApi = async (category: Category): Promise<Category> => {
  const res = await api.post<Category>("/categories", category);
  return res.data;
};

export const updateCategoryApi = async (id: string, updates: Partial<Category>) => {
  const res = await api.patch<Category>(`/categories/${id}`, updates);
  return res.data;
};

export const deleteCategoryApi = async (id: string) => {
  const res = await api.delete<Category>(`/categories/${id}`);
  return res.data;
};