import api from './axios';

export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const getAddresses = () => api.get('/users/addresses');
export const addAddress = (data) => api.post('/users/addresses', data);
export const updateAddress = (addressId, data) =>
  api.put(`/users/addresses/${addressId}`, data);
export const deleteAddress = (addressId) =>
  api.delete(`/users/addresses/${addressId}`);
export const getWishlist = () => api.get('/users/wishlist');
export const toggleWishlist = (productId) =>
  api.post(`/users/wishlist/${productId}`);
export const getAllUsers = () => api.get('/admin/users');
export const toggleUserActive = (id) => api.patch(`/admin/users/${id}/toggle`);
