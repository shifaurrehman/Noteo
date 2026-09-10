import { http, HttpResponse } from "msw";

const API_URL = "https://api.example.com"; // Mock API URL

export const handlers = [
  // Auth
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      token: "mock-token",
      user: { id: "1", email: "test@example.com", name: "Test User" },
    });
  }),

  // Notes
  http.get(`${API_URL}/notes`, () => {
    return HttpResponse.json([
      { id: "1", title: "Test Note 1", content: "Content 1", categoryId: "cat1", createdAt: new Date().toISOString() },
      { id: "2", title: "Test Note 2", content: "Content 2", categoryId: "cat2", createdAt: new Date().toISOString() },
    ]);
  }),

  http.post(`${API_URL}/notes`, async ({ request }) => {
    const newNote = await request.json();
    return HttpResponse.json({ ...(newNote as any), id: "3", createdAt: new Date().toISOString() }, { status: 201 });
  }),

  // Categories
  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json([
      { id: "cat1", name: "Work", color: "#FF0000" },
      { id: "cat2", name: "Personal", color: "#00FF00" },
    ]);
  }),
];
