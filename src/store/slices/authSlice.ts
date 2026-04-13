import { User } from "@/types/user/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
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

export const { setUser, setLoading, setError, logout, updateUser, setLastSyncAt, loginUser, registerUser } =
  authSlice.actions;
export default authSlice.reducer;
