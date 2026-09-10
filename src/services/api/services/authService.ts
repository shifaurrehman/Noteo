import { User } from "@/types";
import { LoginResponse, RegisterResponse } from "@/types/auth/auth.types";
import api from "../config/api";
import { API_ENDPOINTS } from "../config/endpoints";

// REGISTER USER
export const registerUserApi = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const response = await api.post(API_ENDPOINTS.auth.register, payload);
  return response.data;
};

// LOGIN USER
export const loginUserApi = async (payload: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await api.post(API_ENDPOINTS.auth.login, payload);
  return response.data;
};

// GET USER BY ID
export const fetchUserByIdApi = async (id: string): Promise<User> => {
  const response = await api.get(API_ENDPOINTS.users.getById(id));
  return response.data;
};

// FORGOT PASSWORD
export const forgotPasswordApi = async (payload: { email: string }): Promise<void> => {
  const response = await api.post(API_ENDPOINTS.auth.forgotPassword, payload);
  return response.data;
};

// RESET PASSWORD
export const resetPasswordApi = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<void> => {
  const response = await api.post(API_ENDPOINTS.auth.resetPassword, payload);
  return response.data;
};

// VERIFY EMAIL
export const verifyEmailApi = async (payload: { email: string; otp: string }): Promise<LoginResponse> => {
  const response = await api.post(API_ENDPOINTS.auth.verifyEmail, payload);
  return response.data;
};

// RESEND VERIFICATION EMAIL
export const resendVerificationEmailApi = async (payload: { email: string }): Promise<void> => {
  const response = await api.post("/auth/resend-verification", payload);
  return response.data;
};

// LOGOUT FROM ALL DEVICES
export const logoutAllApi = async (): Promise<{ message: string }> => {
  const response = await api.post("/auth/logout-all");
  return response.data;
};
