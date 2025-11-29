/**
 * Order History API Module
 * Get user order history with full details
 */

import axiosInstance from './axiosConfig';

/**
 * Get order history for authenticated user
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise<Object>} { success, data: { orders, pagination } }
 */
export const getOrderHistory = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/order-history.php', { params });
    return response; // Don't wrap again - already has success and data
  } catch (error) {
    console.error('Error fetching order history:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch order history'
    };
  }
};

/**
 * Get order details by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} { success, data: order }
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get('/api/order-details.php', {
      params: { id: orderId }
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch order details'
    };
  }
};

export default {
  getOrderHistory,
  getOrderById
};
