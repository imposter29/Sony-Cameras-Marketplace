import api from './axios';

export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getAllOrders = () => api.get('/orders/all');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });
