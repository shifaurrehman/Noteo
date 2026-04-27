import AsyncStorage from "@react-native-async-storage/async-storage";

export const validateName = (name: string) => name.trim().length >= 2;

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => password.length >= 8;

export const clearStorage = () => {
  // We no longer clear all storage on logout to preserve offline notes/categories.
  // Sensitive tokens are cleared separately by tokenStorage.clearTokens().
};
