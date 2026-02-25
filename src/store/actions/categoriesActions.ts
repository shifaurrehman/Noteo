// UI Actions
export const ADD_CATEGORY = "categories/addCategory";
export const UPDATE_CATEGORY = "categories/updateCategory";
export const DELETE_CATEGORY = "categories/deleteCategory";
export const FETCH_CATEGORIES = "categories/fetchCategories";

// Shadow Actions for Sagas
export const ADD_CATEGORY_API = "categories/addCategory_API";
export const UPDATE_CATEGORY_API = "categories/updateCategory_API";
export const DELETE_CATEGORY_API = "categories/deleteCategory_API";
export const FETCH_CATEGORIES_API = "categories/fetchCategories_API";

// Map UI actions to Shadow Actions
export const CATEGORIES_API_MAP: Record<string, string> = {
  [ADD_CATEGORY]: ADD_CATEGORY_API,
  [UPDATE_CATEGORY]: UPDATE_CATEGORY_API,
  [DELETE_CATEGORY]: DELETE_CATEGORY_API,
  [FETCH_CATEGORIES]: FETCH_CATEGORIES_API,
};