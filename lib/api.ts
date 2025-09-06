import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create an Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You can add auth tokens or other headers here if needed
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // You could add token refresh logic here if needed
      if (typeof window !== 'undefined') {
        // Clear any invalid tokens
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle GET requests
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// Helper function to handle POST requests
export const post = async <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

// Helper function to handle PUT requests
export const put = async <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

// Helper function to handle DELETE requests
export const del = async <T, D = any>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api;
