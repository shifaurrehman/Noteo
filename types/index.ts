export interface Note {
  id: string;
  categoryId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  color?: string;
  icon?: string;
  isFavorite?: boolean,
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

