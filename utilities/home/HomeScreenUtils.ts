import { Category } from "@/types/category";

interface FilterCategoriesOptions {
  searchText?: string;
  favoritesOnly?: boolean;
}

export const filterCategories = (
  categories: Category[],
  options: FilterCategoriesOptions = {}
): Category[] => {
  const { searchText = "", favoritesOnly = false } = options;
  let filtered = categories;

  // Filter by favorite if needed
  if (favoritesOnly) {
    filtered = filtered.filter((category) => category.isFavorite);
  }
  // Filter by search text
  if (searchText.trim()) {
    const searchQuery = searchText.toLowerCase();
    filtered = filtered.filter((category) => category.name.toLowerCase().includes(searchQuery));
  }
  return filtered;
};


