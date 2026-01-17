import { BASE_URL } from "@/utilities";


// Auth endpoints
export const AUTH = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
};

// Users (for admin or profile fetch)
export const USERS = {
  GET_BY_ID: (id: string) => `${BASE_URL}/users/${id}`,
  GET_ALL: `${BASE_URL}/users`,
};

// Notes endpoints
export const NOTES = {
  GET_ALL: `${BASE_URL}/notes`,
  CREATE: `${BASE_URL}/notes`,
  UPDATE: (id: string) => `${BASE_URL}/notes/${id}`,
  DELETE: (id: string) => `${BASE_URL}/notes/${id}`,
};

// Categories endpoints
export const CATEGORIES = {
  GET_ALL: `${BASE_URL}/categories`,
  CREATE: `${BASE_URL}/categories`,
  UPDATE: (id: string) => `${BASE_URL}/categories/${id}`,
  DELETE: (id: string) => `${BASE_URL}/categories/${id}`,
};

// Sync endpoints (if you have any batch sync)
export const SYNC = {
  SYNC_DATA: `${BASE_URL}/sync`,
};





































// api/endpoints.ts - API Endpoints Configuration for React Native App

const BASE_URLd = 'http://localhost:3000'; // Change this for production
const API_VERSION = 'api/v1';

export const API_BASE = `${BASE_URL}/${API_VERSION}`;

// ============================================
// AUTH ENDPOINTS (No authentication required)
// ============================================
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE}/auth/register`,      // POST
  LOGIN: `${API_BASE}/auth/login`,            // POST
};

// ============================================
// USER ENDPOINTS (Requires JWT token)
// ============================================
export const USER_ENDPOINTS = {
  GET_PROFILE: `${API_BASE}/users/profile`,   // GET
};

// ============================================
// CATEGORIES ENDPOINTS (Requires JWT token)
// ============================================
export const CATEGORY_ENDPOINTS = {
  CREATE: `${API_BASE}/categories`,           // POST
  GET_ALL: `${API_BASE}/categories`,          // GET
  GET_ONE: (id: string) => `${API_BASE}/categories/${id}`,  // GET
  UPDATE: (id: string) => `${API_BASE}/categories/${id}`,   // PATCH
  DELETE: (id: string) => `${API_BASE}/categories/${id}`,   // DELETE
};

// ============================================
// NOTES ENDPOINTS (Requires JWT token)
// ============================================
export const NOTE_ENDPOINTS = {
  CREATE: `${API_BASE}/notes`,                // POST
  GET_ALL: `${API_BASE}/notes`,               // GET
  GET_ONE: (id: string) => `${API_BASE}/notes/${id}`,       // GET
  UPDATE: (id: string) => `${API_BASE}/notes/${id}`,        // PATCH
  DELETE: (id: string) => `${API_BASE}/notes/${id}`,        // DELETE
};

// ============================================
// SYNC ENDPOINTS (Requires JWT token)
// ============================================
export const SYNC_ENDPOINTS = {
  PUSH: `${API_BASE}/sync/push`,              // POST
  PULL: (lastSyncAt?: string) => 
    `${API_BASE}/sync/pull${lastSyncAt ? `?lastSyncAt=${lastSyncAt}` : ''}`,  // GET
};

// ============================================
// HEALTH CHECK (No authentication required)
// ============================================
export const HEALTH_ENDPOINT = `${API_BASE}/`;  // GET

// ============================================
// EXAMPLE USAGE IN YOUR REACT NATIVE APP
// ============================================
/*

// 1. Register a new user
fetch(AUTH_ENDPOINTS.REGISTER, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});

// 2. Login
const loginResponse = await fetch(AUTH_ENDPOINTS.LOGIN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// 3. Get user profile (with token)
fetch(USER_ENDPOINTS.GET_PROFILE, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

// 4. Create a category (with token)
fetch(CATEGORY_ENDPOINTS.CREATE, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'Work',
    color: '#FF5733'
  })
});

// 5. Get all notes (with token)
fetch(NOTE_ENDPOINTS.GET_ALL, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

// 6. Sync - Push local changes (with token)
fetch(SYNC_ENDPOINTS.PUSH, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    notes: [...],
    categories: [...]
  })
});

// 7. Sync - Pull server changes (with token)
fetch(SYNC_ENDPOINTS.PULL('2024-01-01T00:00:00Z'), {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

*/