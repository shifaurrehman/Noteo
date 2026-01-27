import { loginUser, registerUser, logout } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { LoginCredentials, RegisterData } from "@/types/auth/auth.types";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = (data: RegisterData) => {
    return dispatch(registerUser(data));
  };

  const logoutUser = () => {
    return dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logoutUser,
  };
};
