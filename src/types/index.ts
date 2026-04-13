export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";
export type GridDensity = "comfortable" | "compact";

export type SyncStatus = 'synced' | 'syncing' | 'error';

export interface AppSettings {
  theme: ThemeMode;
  fontSize: FontSize;
  gridDensity: GridDensity;
  backupEnabled: boolean;
  syncStatus?: SyncStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSyncAt?: string;
}

export * from "./category/category.types";
export * from "./notes/notes.types";
