import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  registered: boolean;
  lastSyncAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      // registered remains true if previously registered
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLastSyncAt: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.lastSyncAt = action.payload;
      }
    },
    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {},
    registerUser: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {},
  },
});

export const { setUser, setToken, setLoading, setError, logout, updateUser, setLastSyncAt, loginUser, registerUser } =
  authSlice.actions;
export default authSlice.reducer;
