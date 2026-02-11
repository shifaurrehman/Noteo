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

