import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
};

export const patientAPI = {
  getAll: () => API.get('/patients'),
  getMe: () => API.get('/patients/me'),
  register: (data) => API.post('/patients/register', data),
  update: (id, data) => API.put(`/patients/${id}`, data),
  delete: (id) => API.delete(`/patients/${id}`),
};

export const doctorAPI = {
  getAll: (params) => API.get('/doctors', { params }),
  getById: (id) => API.get(`/doctors/${id}`),
  create: (data) => API.post('/doctors', data),
  update: (id, data) => API.put(`/doctors/${id}`, data),
  delete: (id) => API.delete(`/doctors/${id}`),
};

export const appointmentAPI = {
  getAll: () => API.get('/appointments'),
  getById: (id) => API.get(`/appointments/${id}`),
  book: (data) => API.post('/appointments', data),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  cancel: (id) => API.delete(`/appointments/${id}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export const profileAPI = {
  get: () => API.get('/profile'),
  update: (data) => API.put('/profile', data),
  changePassword: (data) => API.put('/profile/password', data),
};

export default API;
