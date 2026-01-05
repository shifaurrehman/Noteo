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

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  theme: ThemeMode;
  fontSize?: 'small' | 'medium' | 'large';
  notifications?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSyncAt?: string;
}

