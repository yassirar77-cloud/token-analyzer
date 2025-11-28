import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  getNonce: (walletAddress: string) =>
    api.get(`/auth/nonce/${walletAddress}`),

  verify: (walletAddress: string, signature: string) =>
    api.post('/auth/verify', { walletAddress, signature }),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: any) => api.put('/users/profile', data),

  getUser: (id: string) => api.get(`/users/${id}`),

  getLibrary: () => api.get('/users/library'),
};

// Track API
export const trackApi = {
  upload: (formData: FormData) =>
    api.post('/tracks/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  create: (data: any) => api.post('/tracks', data),

  getAll: (params?: any) => api.get('/tracks', { params }),

  getById: (id: string) => api.get(`/tracks/${id}`),

  stream: (id: string) => api.get(`/tracks/${id}/stream`, {
    responseType: 'blob',
  }),

  getAnalytics: (id: string) => api.get(`/tracks/${id}/analytics`),
};

export default api;
