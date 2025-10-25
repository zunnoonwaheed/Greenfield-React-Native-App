import axiosInstance from './axiosConfig';

export const submitOrder = async (orderData) => {
  return await axiosInstance.post('/orders', orderData);
};

export const getOrderDetails = async (orderId) => {
  return await axiosInstance.get(`/orders/${orderId}`);
};

export const getMyOrders = async (limit = 50) => {
  return await axiosInstance.get(`/orders/my-orders?limit=${limit}`);
};

export const trackOrder = async (orderId) => {
  return await axiosInstance.get(`/orders/${orderId}/track`);
};

export const updateOrderStatus = async (orderId, status) => {
  return await axiosInstance.put(`/orders/${orderId}/status`, { status });
};
