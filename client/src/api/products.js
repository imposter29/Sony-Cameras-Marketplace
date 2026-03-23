import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getCategories = () => api.get('/categories');
export const getCompareProducts = (ids) => api.get(`/products/compare?ids=${ids}`);
export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
