const API_HOST = process.env.EXPO_PUBLIC_API_HOST!;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT!;
const API_VERSION = process.env.EXPO_PUBLIC_API_VERSION!;

export const BASE_URL = `http://${API_HOST}:${API_PORT}${API_VERSION}`;