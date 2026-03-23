import api from './axios';

export const getProductReviews = (productId) =>
  api.get(`/reviews/product/${productId}`);
export const addReview = (productId, data) =>
  api.post(`/reviews/product/${productId}`, data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
