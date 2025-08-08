import axios from 'axios';
import Cookies from 'js-cookie';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!Cookies.get('access_token');
};

export const handleError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/login',
  SIGNUP: '/signup',
  ME: '/me',
  FORGOT_PASSWORD: '/forgot-password/',
  RESET_PASSWORD: '/reset-password/',
  PERSONAL_INFORMATION: '/personal-information/',
  USERNAME_SUGGESTIONS: '/username-suggestions',

  // Posts endpoints
  POSTS: '/posts',
  POST_LIKES: (postId: string) => `/posts/${postId}/likes/`,
  POST_LIKE: (postId: string) => `/posts/${postId}/like/`,
  POST_SAVE: (postId: string) => `/posts/${postId}/save/`,
  POST_COMMENTS: (postId: string) => `/posts/${postId}/comments/`,
  POST_FAVORITE: (postId: string) => `/post/${postId}/favorite/`,

  // User endpoints
  USER_FOLLOW: (userId: string) => `/users/${userId}/follow/`,
  USER_FOLLOW_STATUS: (userId: string) => `/users/${userId}/follow-status/`,
} as const;
