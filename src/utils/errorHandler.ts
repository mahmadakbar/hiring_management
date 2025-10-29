import { AxiosError } from "axios";
import { toast } from "@components/atoms/sonner";

/**
 * Error response structure from API
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  showToast?: boolean;
  customMessages?: {
    [key: number]: string;
  };
  fallbackMessage?: string;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}

/**
 * Global error handler for API errors
 * Handles Axios errors with custom messages and toast notifications
 */
export const handleApiError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    showToast = true,
    customMessages = {},
    fallbackMessage = "Terjadi kesalahan. Silakan coba lagi.",
    onError,
  } = options;

  let errorMessage = fallbackMessage;

  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Call custom error handler if provided
    if (onError) {
      onError(axiosError);
    }

    if (axiosError.response) {
      const status = axiosError.response.status;

      // Check for custom messages first
      if (customMessages[status]) {
        errorMessage = customMessages[status];
      } else {
        // Default messages based on status code
        switch (status) {
          case 400:
            errorMessage =
              axiosError.response.data?.error ||
              "Data yang dimasukkan tidak valid.";
            break;
          case 401:
            errorMessage = "Anda tidak memiliki akses. Silakan login kembali.";
            break;
          case 403:
            errorMessage = "Anda tidak memiliki izin untuk melakukan aksi ini.";
            break;
          case 404:
            errorMessage = "Data tidak ditemukan.";
            break;
          case 409:
            errorMessage =
              axiosError.response.data?.error ||
              "Data sudah ada. Silakan gunakan data lain.";
            break;
          case 422:
            errorMessage = "Data yang dikirim tidak dapat diproses.";
            break;
          case 500:
            errorMessage = "Terjadi kesalahan server. Silakan coba lagi nanti.";
            break;
          case 502:
          case 503:
          case 504:
            errorMessage =
              "Server sedang tidak tersedia. Silakan coba lagi nanti.";
            break;
          default:
            errorMessage =
              axiosError.response.data?.error ||
              axiosError.response.data?.message ||
              fallbackMessage;
        }
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      errorMessage =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    }

    // Log error for debugging
    console.error("API Error:", {
      status: axiosError.response?.status,
      message: errorMessage,
      data: axiosError.response?.data,
    });
  } else {
    // Handle non-Axios errors
    console.error("Unexpected error:", error);
  }

  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }

  return errorMessage;
};

/**
 * Specific error handler for registration
 */
export const handleRegistrationError = (error: unknown): string => {
  return handleApiError(error, {
    showToast: true,
    customMessages: {
      409: "Email sudah terdaftar. Silakan gunakan email lain.",
    },
    fallbackMessage: "Gagal mendaftar. Silakan coba lagi.",
  });
};

/**
 * Specific error handler for login
 */
export const handleLoginError = (error: unknown): string => {
  return handleApiError(error, {
    showToast: true,
    customMessages: {
      401: "Email atau password salah. Silakan coba lagi.",
      404: "Akun tidak ditemukan. Silakan daftar terlebih dahulu.",
    },
    fallbackMessage: "Gagal masuk. Silakan coba lagi.",
  });
};

/**
 * Specific error handler for authentication
 */
export const handleAuthError = (error: unknown): string => {
  return handleApiError(error, {
    showToast: true,
    customMessages: {
      401: "Sesi Anda telah berakhir. Silakan login kembali.",
      403: "Anda tidak memiliki akses ke halaman ini.",
    },
    fallbackMessage: "Terjadi kesalahan autentikasi.",
  });
};

/**
 * Extract error message from error object without showing toast
 * Useful for setting local error state in components
 */
export const extractErrorMessage = (error: unknown): string => {
  return handleApiError(error, { showToast: false });
};
