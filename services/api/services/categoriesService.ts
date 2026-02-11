import { Category, CategoryApi } from "@/types/category/category.types";
import api from "../config/api";
import { API_ENDPOINTS } from "../config/endpoints";

// Get all categories
export const fetchCategoriesApi = async (): Promise<CategoryApi[]> => {
  const response = await api.get<CategoryApi[]>(API_ENDPOINTS.categories.getAll);
  return response.data;
};

export const createCategoryApi = async (category: CategoryApi): Promise<CategoryApi> => {
  const res = await api.post<CategoryApi>(API_ENDPOINTS.categories.create, category);
  return res.data;
};

export const updateCategoryApi = async (id: string, updates: Partial<CategoryApi>) => {
  const res = await api.patch<CategoryApi>(API_ENDPOINTS.categories.update(id), updates);
  return res.data;
};

export const deleteCategoryApi = async (id: string) => {
  const res = await api.delete<Category>(API_ENDPOINTS.categories.delete(id));
  return res.data;
};

export const syncCategoriesApi = async (payload: {
  created: CategoryApi[];
  updated: CategoryApi[];
  deleted: { id: string }[];
}) => {
  const res = await api.post(API_ENDPOINTS.sync.categories, payload);
  return res.data;
};
