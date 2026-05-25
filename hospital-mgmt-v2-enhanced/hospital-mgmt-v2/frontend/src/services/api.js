import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
//added
// Auth
export const adminLogin = (data) => API.post('/auth/admin/login', data);
export const doctorLogin = (data) => API.post('/auth/doctor/login', data);
export const patientLogin = (data) => API.post('/auth/patient/login', data);
export const registerPatient = (data) => API.post('/auth/register', { ...data, role: 'patient' });
export const registerDoctor = (data) => API.post('/auth/register', { ...data, role: 'doctor' });
export const getMe = () => API.get('/auth/me');

// Admin - Stats & Users
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const updateAdminUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

// Admin - Doctors
export const getAllDoctors = () => API.get('/admin/doctors');
export const getPendingDoctors = () => API.get('/admin/doctors/pending');
export const verifyDoctor = (id, data) => API.put(`/admin/doctors/${id}/verify`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

// Admin - Appointments
export const getAllAppointments = () => API.get('/admin/appointments');
export const updateAppointmentStatus = (id, data) => API.put(`/admin/appointments/${id}/status`, data);

// Doctor
export const getDoctorStats = () => API.get('/doctor/stats');
export const getDoctorAppointments = () => API.get('/doctor/appointments');
export const getDoctorAllAppointments = () => API.get('/doctor/appointments/all');
export const getDoctorProfile = () => API.get('/doctor/profile');
export const updateDoctorProfile = (data) => API.put('/doctor/profile', data);
export const updateDoctorAppointment = (id, data) => API.put(`/doctor/appointments/${id}`, data);
export const addDoctorLeave = (data) => API.post('/doctor/leave', data);
export const removeDoctorLeave = (data) => API.delete('/doctor/leave', { data });

// Patient
export const getPatientStats = () => API.get('/patient/stats');
export const getPatientAppointments = () => API.get('/patient/appointments');
export const bookAppointment = (data) => API.post('/patient/appointments', data);
export const cancelAppointment = (id) => API.delete(`/patient/appointments/${id}`);
export const getPatientDoctors = () => API.get('/patient/doctors');
export const getDoctorSlots = (doctorId, date) => API.get(`/patient/doctors/${doctorId}/slots?date=${date}`);
export const getPatientProfile = () => API.get('/patient/profile');
export const updatePatientProfile = (data) => API.put('/patient/profile', data);

export default API;
