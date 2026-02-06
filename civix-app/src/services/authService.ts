import api from './api';

export interface AuthResponse {
  success: boolean;
  token: string;
}

export const login = async (credentials: Record<string, string>): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (userData: Record<string, string>): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const toggleBookmark = async (reportId: string) => {
  const response = await api.put(`/users/bookmark/${reportId}`);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/users/bookmarks');
  return response.data;
};

export const googleAuth = async (idToken: string): Promise<AuthResponse & { newUser?: boolean; email?: string; name?: string }> => {
  const response = await api.post('/auth/google', { idToken });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const followUser = (id: string) => api.put(`/users/follow/${id}`);
export const unfollowUser = (id: string) => api.put(`/users/unfollow/${id}`);
export const getPublicProfile = (id: string) => api.get(`/users/${id}`);
export const updateProfile = (data: any) => api.put('/users/profile', data);
