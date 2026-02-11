import { SyncStatus } from "../category/category.types";

export interface CreateNewNoteParams {
  title: string;
  content: string;
  categoryId: string;
  isFavorite?: boolean;
}

export interface NoteApi {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  version: number;
}

export interface Note extends NoteApi {
  syncStatus?: SyncStatus;
}
