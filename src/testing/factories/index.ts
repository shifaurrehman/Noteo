import { Note } from "@/types/notes";
import { Category } from "@/types/categories";

export const noteFactory = (overrides: Partial<Note> = {}): Note => ({
  id: Math.random().toString(36).substr(2, 9),
  title: "Test Note",
  content: "This is a test note content",
  categoryId: "cat1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const categoryFactory = (overrides: Partial<Category> = {}): Category => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "Test Category",
  color: "#FF0000",
  icon: "folder",
  ...overrides,
});

export const authStateFactory = (overrides: any = {}) => ({
  user: {
    id: "user1",
    email: "test@example.com",
    name: "Test User",
  },
  token: "mock-token",
  isAuthenticated: true,
  loading: false,
  error: null,
  ...overrides,
});
