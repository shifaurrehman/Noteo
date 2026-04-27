const API_HOST = process.env.EXPO_PUBLIC_API_HOST!;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION!;

const getBaseUrl = () => {
  if (API_HOST.startsWith("http")) {
    return `${API_HOST}${API_VERSION}`;
  }

  const isLocal = API_HOST === "localhost" || API_HOST.match(/^\d+\.\d+\.\d+\.\d+$/);
  const protocol = isLocal ? "http" : "https";
  const portPart = API_PORT ? `:${API_PORT}` : "";

  return `${protocol}://${API_HOST}${portPart}${API_VERSION}`;
};

export const BASE_URL = getBaseUrl();