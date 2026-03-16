export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  fontSize?: "small" | "medium" | "large";
  gridDensity: "comfortable" | "compact";
  syncStatus: "synced" | "syncing" | "error";
  backupEnabled: boolean;
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
