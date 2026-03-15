import axios from 'axios';

export interface TrackData {
  id: string;
  trackId: number;
  artistId: string;
  title: string;
  artist: string;
  description?: string;
  genre?: string;
  duration?: number;
  ipfsHash: string;
  coverImage?: string;
  streamingPrice?: string;
  nftPrice?: string;
  maxEditions: number;
  mintedEditions: number;
  totalStreams: number;
  totalPurchases: number;
  createdAt: string;
  updatedAt: string;
  artistUser?: {
    id: string;
    username?: string;
    walletAddress: string;
    isVerified: boolean;
  };
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  isArtist: boolean;
  isVerified: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle error responses centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

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

  updateProfile: (data: Partial<Pick<UserProfile, 'username' | 'email' | 'bio' | 'profileImage' | 'isArtist'>>) =>
    api.put('/users/profile', data),

  getUser: (id: string) => api.get(`/users/${id}`),

  getLibrary: () => api.get('/users/library'),
};

// Track API
export const trackApi = {
  upload: (formData: FormData) =>
    api.post('/tracks/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  create: (data: Omit<TrackData, 'id' | 'artistId' | 'mintedEditions' | 'totalStreams' | 'totalPurchases' | 'createdAt' | 'updatedAt' | 'artistUser'>) =>
    api.post('/tracks', data),

  getAll: (params?: { genre?: string; artistId?: string; search?: string; limit?: number; offset?: number }) =>
    api.get<TrackData[]>('/tracks', { params }),

  getById: (id: string) => api.get(`/tracks/${id}`),

  stream: (id: string) => api.get(`/tracks/${id}/stream`, {
    responseType: 'blob',
  }),

  getAnalytics: (id: string) => api.get(`/tracks/${id}/analytics`),
};

export default api;
