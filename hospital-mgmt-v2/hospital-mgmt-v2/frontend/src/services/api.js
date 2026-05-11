import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const adminLogin = (data) => API.post('/auth/admin/login', data);
export const doctorLogin = (data) => API.post('/auth/doctor/login', data);
export const patientLogin = (data) => API.post('/auth/patient/login', data);
export const registerPatient = (data) => API.post('/auth/register', { ...data, role: 'patient' });
export const getMe = () => API.get('/auth/me');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const updateAdminUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAllDoctors = () => API.get('/doctors');
export const createDoctor = (data) => API.post('/doctors', data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);
export const getAllAppointments = () => API.get('/appointments');

// Doctor
export const getDoctorStats = () => API.get('/doctor/stats');
export const getDoctorAppointments = () => API.get('/doctor/appointments');
export const getDoctorProfile = () => API.get('/doctor/profile');
export const updateDoctorAppointment = (id, data) => API.put(`/doctor/appointments/${id}`, data);

// Patient
export const getPatientStats = () => API.get('/patient/stats');
export const getPatientAppointments = () => API.get('/patient/appointments');
export const bookAppointment = (data) => API.post('/patient/appointments', data);
export const cancelAppointment = (id) => API.delete(`/patient/appointments/${id}`);
export const getPatientDoctors = () => API.get('/patient/doctors');
export const getPatientProfile = () => API.get('/patient/profile');
export const updatePatientProfile = (data) => API.put('/patient/profile', data);

export default API;
