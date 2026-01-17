export interface Note {
  id: string;
  categoryId: string;
  userId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  syncStatus: string;
  version: number;
}

export type ViewCategoryNotesParams = {
    categoryId: string;
    categoryName: string;
    isFavorite?: boolean;
};