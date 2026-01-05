export interface Category {
  id: string;
  userId: string;
  name: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  syncStatus: "pending" | "synced" | "error";
  version: number;
}
