import { BASE_URL } from "./api.config";

const createEndpoint = (path: string) => `${BASE_URL}${path}`;

const createResourceEndpoints = (resource: string) => ({
  getAll: createEndpoint(`/${resource}`),
  getById: (id: string) => createEndpoint(`/${resource}/${id}`),
  create: createEndpoint(`/${resource}`),
  update: (id: string) => createEndpoint(`/${resource}/${id}`),
  delete: (id: string) => createEndpoint(`/${resource}/${id}`),
});

export const API_ENDPOINTS = {
  auth: {
    login: createEndpoint("/auth/login"),
    register: createEndpoint("/auth/register"),
    refreshToken: createEndpoint("/auth/refresh"),
    forgotPassword: createEndpoint("/auth/forgot-password"),
    resetPassword: createEndpoint("/auth/reset-password"),
    logout: createEndpoint("/auth/logout"),
    verifyEmail: createEndpoint("/auth/verify-email"),
    resendVerification: createEndpoint("/auth/resend-verification"),
  },

  categories: createResourceEndpoints("categories"),
  notes: createResourceEndpoints("notes"),
  users: createResourceEndpoints("users"),
  settings: createEndpoint("/settings"),

  sync: {
    categories: createEndpoint("/sync/categories"),
    notes: createEndpoint("/sync/notes"),
  },
} as const;
