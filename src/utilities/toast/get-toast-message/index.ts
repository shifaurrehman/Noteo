import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response as {
        status: number;
        data?: any;
      };

      switch (status) {
        case 403:
          return "You are not allowed to perform this action.";
        case 404:
          return "Requested resource was not found.";
        case 429:
          return "Too many requests. Please slow down.";
        default:
          if (status >= 500) {
            return "Something went wrong on our end. Please try again later.";
          }
      }

      if (Array.isArray(data?.message) && data.message.length > 0) {
        return data.message[0];
      }

      if (typeof data?.message === "string") {
        return data.message;
      }

      if (typeof data?.error === "string") {
        return data.error;
      }

      if (typeof data?.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && Array.isArray(data.errors[firstKey])) {
          return data.errors[firstKey][0];
        }
      }

      return "Request failed. Please try again.";
    }

    if (error.request) {
      return "Network error. Please check your internet connection.";
    }

    return "Failed to send request. Please try again.";
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong.";
  }

  return "An unexpected error occurred. Please try again.";
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as AxiosError).isAxiosError === true
  );
}
