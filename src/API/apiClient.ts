import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type AxiosRequestConfig,
} from "axios";
import baseURL from "./baseUrl";
import toast from "react-hot-toast";

/**
 * Event Emitter
 */
type Listener<T extends any[] = any[]> = (...args: T) => void;

export class ApiEventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, fn: Listener) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }

  off(event: string, fn: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((f) => f !== fn);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((fn) => fn(...args));
  }
}

export const apiEvents = new ApiEventEmitter();

let activeRequests = 0;

function updateLoading() {
  apiEvents.emit("loading", activeRequests > 0);
}

/**
 * Axios Client
 */
const apiClient = axios.create({
  baseURL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Extend Window for token storage
 */
declare global {
  interface Window {
    authToken?: string;
    refreshToken?: string;
  }
}

/**
 * Token Manager
 */
export const tokenManager = {
  getToken: (): string | null => window.authToken || null,

  setToken: (token: string): void => {
    window.authToken = token;
  },

  removeToken: (): void => {
    delete window.authToken;
  },

  getRefreshToken: (): string | null => window.refreshToken || null,

  setRefreshToken: (token: string): void => {
    window.refreshToken = token;
  },
};

/**
 * Extend Axios Config to support metadata + retry tracking
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
  _retry?: boolean;
  _retryCount?: number;
}

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
    activeRequests++;
    updateLoading();

    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.metadata = { startTime: new Date() };

    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    updateLoading();
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    updateLoading();

    const cfg = response.config as CustomAxiosRequestConfig;
    const duration = cfg.metadata
      ? new Date().getTime() - cfg.metadata.startTime.getTime()
      : 0;

    console.log(
      `✅ [${cfg.method?.toUpperCase()}] ${cfg.url} - ${response.status} (${duration}ms)`
    );

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    activeRequests = Math.max(activeRequests - 1, 0);
    updateLoading();

    const duration = originalRequest.metadata
      ? new Date().getTime() - originalRequest.metadata.startTime.getTime()
      : 0;

    console.error(
      `❌ [${originalRequest.method?.toUpperCase()}] ${originalRequest.url} - ${
        error.response?.status || "Network Error"
      } (${duration}ms)`
    );

    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          return handleUnauthorized(error, originalRequest);
        case 403:
          return handleForbidden(error);
        case 404:
          return handleNotFound(error);
        case 422:
          return handleValidationError(error);
        case 429:
          return handleRateLimit(error, originalRequest);
        case 500:
        case 502:
        case 503:
        case 504:
          return handleServerError(error, originalRequest);
        default:
          return handleGenericError(error);
      }
    } else if (error.request) {
      return handleNetworkError(error, originalRequest);
    } else {
      return handleRequestError(error);
    }
  }
);

/**
 * Error Handlers
 */
async function handleUnauthorized(
  error: AxiosError,
  originalRequest: CustomAxiosRequestConfig
) {
  const refreshToken = tokenManager.getRefreshToken();

  if (originalRequest._retry || !refreshToken) {
    tokenManager.removeToken();
    window.location.href = "/login";
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    const response = await axios.post(`${baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data as {
      accessToken: string;
      refreshToken: string;
    };

    tokenManager.setToken(accessToken);
    tokenManager.setRefreshToken(newRefreshToken);

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    tokenManager.removeToken();
    window.location.href = "/login";
    return Promise.reject(refreshError);
  }
}

function handleForbidden(error: AxiosError) {
  showErrorNotification("Access forbidden. You don't have permission.");
  return Promise.reject({
    ...error,
    userMessage: "You don't have permission to perform this action",
  });
}

function handleNotFound(error: AxiosError) {
  showErrorNotification("Resource not found.");
  return Promise.reject({
    ...error,
    userMessage: "The requested resource was not found",
  });
}

function handleValidationError(error: AxiosError) {
  const validationErrors =
    (error.response?.data as { errors?: Record<string, string[]> })?.errors ||
    {};
  const messages = Object.values(validationErrors).flat();

  showErrorNotification(`Validation failed: ${messages.join(", ")}`);
  return Promise.reject({
    ...error,
    userMessage: "Please check your input and try again",
    validationErrors,
  });
}

async function handleRateLimit(
  error: AxiosError,
  originalRequest: CustomAxiosRequestConfig
) {
  const retryAfter =
    Number(error.response?.headers?.["retry-after"]) || 1;

  showErrorNotification(
    `Rate limit exceeded. Retrying in ${retryAfter} seconds...`
  );

  await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
  return apiClient(originalRequest);
}

async function handleServerError(
  error: AxiosError,
  originalRequest: CustomAxiosRequestConfig
) {
  const maxRetries = 3;
  const retryCount = originalRequest._retryCount || 0;

  if (retryCount < maxRetries) {
    originalRequest._retryCount = retryCount + 1;
    const delay = Math.pow(2, retryCount) * 1000;

    console.log(
      `🔄 Retrying request (${retryCount + 1}/${maxRetries}) in ${delay}ms`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return apiClient(originalRequest);
  }

  showErrorNotification("Server error. Please try again later.");
  return Promise.reject({
    ...error,
    userMessage: "Server error. Please try again later.",
  });
}

async function handleNetworkError(
  error: AxiosError,
  originalRequest: CustomAxiosRequestConfig
) {
  const maxRetries = 2;
  const retryCount = originalRequest._retryCount || 0;

  if (retryCount < maxRetries) {
    originalRequest._retryCount = retryCount + 1;
    const delay = 2000;

    console.log(
      `🔄 Network error, retrying (${retryCount + 1}/${maxRetries}) in ${delay}ms`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return apiClient(originalRequest);
  }

  showErrorNotification("Network error. Please check your connection.");
  return Promise.reject({
    ...error,
    userMessage: "Network error. Please check your internet connection.",
  });
}

function handleRequestError(error: AxiosError) {
  console.error("Request setup error:", error);
  showErrorNotification("Request configuration error.");
  return Promise.reject({
    ...error,
    userMessage: "Request configuration error",
  });
}

function handleGenericError(error: AxiosError) {
  const message =
    (error.response?.data as { message?: string })?.message ||
    "An unexpected error occurred";
  showErrorNotification(message);
  return Promise.reject({
    ...error,
    userMessage: message,
  });
}

/**
 * Notifications
 */
function showErrorNotification(message: string) {
  console.error("API Error:", message);
  toast.error(message);
}

/**
 * API Helper
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),

  setAuthToken: (token: string) => tokenManager.setToken(token),
  removeAuthToken: () => tokenManager.removeToken(),

  requestWithRetry: async <T = any>(
    requestConfig: AxiosRequestConfig,
    maxRetries = 3
  ): Promise<AxiosResponse<T>> => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await apiClient<T>(requestConfig);
      } catch (error) {
        if (i === maxRetries) throw error;
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries exceeded");
  },
};

export default apiClient;
