import api from "../config/api";
import { API_ENDPOINTS } from "../config/endpoints";
import { AppSettings } from "@/types";

export const getSettingsApi = async () => {
  const response = await api.get<AppSettings>(API_ENDPOINTS.settings);
  return response.data;
};

export const updateSettingsApi = async (settings: Partial<AppSettings>) => {
  const response = await api.patch<AppSettings>(API_ENDPOINTS.settings, settings);
  return response.data;
};
