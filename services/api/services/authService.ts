import { User } from "@/types";
import { LoginResponse, RegisterResponse } from "@/types/auth/auth.types";
import api from "../config/api";

// REGISTER USER
export const registerUserApi = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

// LOGIN USER
export const loginUserApi = async (payload: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

// GET USER BY ID
export const fetchUserByIdApi = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// FORGOT PASSWORD
export const forgotPasswordApi = async (payload: { email: string }): Promise<void> => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

// RESET PASSWORD
export const resetPasswordApi = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<void> => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};
