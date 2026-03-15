export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  fontSize?: "small" | "medium" | "large";
  notifications?: boolean;
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
