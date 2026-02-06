import api from './api';

export interface Report {
  _id?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  imageUrl?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    formattedAddress?: string;
    city?: string;
    state?: string;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  upvotes?: number;
  isVerified?: boolean;
  createdAt?: string;
}

export const getReports = async (filters?: { city?: string; state?: string; user?: string }) => {
  const response = await api.get('/reports', { params: filters });
  return response.data;
};

export const getReport = async (id: string) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const createReport = async (reportData: Report | FormData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const updateReport = async (id: string, reportData: Partial<Report> | FormData) => {
  const response = await api.put(`/reports/${id}`, reportData);
  return response.data;
};

export const deleteReport = async (id: string) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};
