// src/api/api.ts
import { Category } from "@/types";
import { BASE_URL } from "@/utilities";

// Categories
export const fetchCategoriesApi = async (): Promise<Category[]> => {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createCategoryApi = async (category: Category): Promise<Category> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};

export const updateCategoryApi = async (id: string, updates: Partial<Category>) => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
};

export const deleteCategoryApi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return true;
};