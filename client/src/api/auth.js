import api from './axios';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password });
export const setPassword = (password) => api.post('/auth/set-password', { password });
