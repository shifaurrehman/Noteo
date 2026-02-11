import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../../storage/tokenStorage";
import { BASE_URL } from "./api.config";
import { authEvents, FORCE_LOGOUT_EVENT } from "@/utilities/events";

interface FailedRequest {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

interface ProcessQueueArgs {
  error: Error | null;
  token: string | null;
}

// constants
const AUTH_WHITELIST = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/reset-password", "/auth/forgot-password", "/auth/verify-email"];
const REQUEST_TIMEOUT = 10000;

// axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = ({ error, token = null }: ProcessQueueArgs) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log("===== AXIOS REQUEST START =====");
    console.log("Request URL:", config.url);
    console.log("Request Headers:", config.headers);
    console.log("===== AXIOS REQUEST END =====");
    const token = await tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.log("===== AXIOS ERROR START =====");

    // 1️⃣ Basic info
    console.log("Request URL:", error.config?.url);
    console.log("Message:", error.message);
    console.log("Name:", error.name);
    console.log("Code:", error.code);
    console.log("Request Headers:", error.config?.headers);
    // 3️⃣ Server responded (4xx / 5xx)
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Status Text:", error.response.statusText);
      console.log("Response Headers:", error.response.headers);
      console.log("Response Data:", error.response.data);
    }

    // 5️⃣ Stack trace
    console.log("Stack:", error.stack);

    console.log("===== AXIOS ERROR END =====");
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest.url || "";
    const isAuthRequest = AUTH_WHITELIST.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oldRefreshToken = await tokenStorage.getRefreshToken();
        if (!oldRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${oldRefreshToken}`,
            },
          }
        );
        const { accessToken, refreshToken } = response.data;
        await tokenStorage.saveTokens(accessToken, refreshToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        processQueue({ error: null, token: accessToken });

        return api(originalRequest);
      } catch (refreshError) {
        processQueue({ error: refreshError as Error, token: null });
        console.error("Refresh token failed:", refreshError);
        await handleForcedLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

const handleForcedLogout = async () => {
  authEvents.emit(FORCE_LOGOUT_EVENT); 
};