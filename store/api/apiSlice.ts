import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Note, Category, User } from '../../types';

// Base API configuration
// TODO: Replace with your actual API base URL
const BASE_URL = 'https://api.example.com'; // Change this to your backend URL

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Notes', 'Categories', 'User'],
  endpoints: (builder) => ({
    // User endpoints
    getUser: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, { email: string; name: string; password: string }>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<{ user: User; token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    syncData: builder.mutation<{ notes: Note[]; categories: Category[] }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/${userId}/sync`,
        method: 'POST',
      }),
      invalidatesTags: ['Notes', 'Categories'],
    }),

    // Notes endpoints
    getNotes: builder.query<Note[], string>({
      query: (userId) => `/users/${userId}/notes`,
      providesTags: ['Notes'],
    }),
    createNote: builder.mutation<Note, Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (note) => ({
        url: '/notes',
        method: 'POST',
        body: note,
      }),
      invalidatesTags: ['Notes'],
    }),
    updateNote: builder.mutation<Note, { id: string; updates: Partial<Note> }>({
      query: ({ id, updates }) => ({
        url: `/notes/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Notes'],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notes'],
    }),

    // Categories endpoints
    getCategories: builder.query<Category[], string>({
      query: (userId) => `/users/${userId}/categories`,
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<Category, Omit<Category, 'id' | 'createdAt'>>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<Category, { id: string; updates: Partial<Category> }>({
      query: ({ id, updates }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useLoginMutation,
  useSyncDataMutation,
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = apiSlice;

