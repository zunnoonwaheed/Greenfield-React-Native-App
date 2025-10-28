import axiosInstance from './axiosConfig';

/**
 * Order API Module
 * Handles all order-related API calls
 */

/**
 * Create a new order
 * @param {Object} orderData - Order data { items, delivery_address_id, payment_method, etc. }
 * @returns {Promise} - Response with created order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders for the authenticated user
 * @param {Object} params - Query parameters { status, limit, offset }
 * @returns {Promise} - Response with orders array
 */
export const getUserOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/orders', { params });
    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

/**
 * Get a single order by ID
 * @param {string|number} orderId - Order ID
 * @returns {Promise} - Response with order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string|number} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} - Response confirming cancellation
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`, { reason });
    return response;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Track order status
 * @param {string|number} orderId - Order ID
 * @returns {Promise} - Response with order tracking info
 */
export const trackOrder = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/track`);
    return response;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
};
