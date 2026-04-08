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

export const googleAuth = async (idToken: string, autoRegister = false): Promise<AuthResponse & { newUser?: boolean; email?: string; name?: string }> => {
  const response = await api.post('/auth/google', { idToken, autoRegister });
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


export const getPublicProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  city?: string;
  avatar?: string;
}

export const updateProfile = (data: UpdateProfileData | FormData) => {
  const isFormData = data instanceof FormData;
  return api.put('/users/profile', data, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
    }
  });
};

export const updatePassword = async (data: { currentPassword: string; newPassword: string }) => api.put('/auth/updatepassword', data);
export const deleteAccount = async () => api.delete('/auth/deleteaccount');
