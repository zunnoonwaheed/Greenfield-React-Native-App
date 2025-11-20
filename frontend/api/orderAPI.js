// ============================================
// ORDER API - PHP BACKEND
// All order-related API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * SUBMIT ORDER
 * POST /submit-order.php
 * @param {Object} orderData - Complete order data
 * @returns {Promise} Response with created order ID
 *
 * Usage:
 * const response = await submitOrder({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '03001234567',
 *   address: 'House #123, Street 5, Phase 2',
 *   phase_id: 1,
 *   sector_id: 5,
 *   payment_method: 'cash_on_delivery',
 *   delivery_notes: 'Call before delivery'
 * });
 */
export const submitOrder = async (orderData) => {
  try {
    console.log('📦 Submitting order:', orderData);

    const formData = new URLSearchParams();

    // User information
    if (orderData.name) formData.append('name', orderData.name);
    if (orderData.email) formData.append('email', orderData.email);
    if (orderData.phone) formData.append('phone', orderData.phone);

    // Delivery address
    if (orderData.address) formData.append('address', orderData.address);
    if (orderData.phase_id) formData.append('phase_id', orderData.phase_id);
    if (orderData.sector_id) formData.append('sector_id', orderData.sector_id);
    if (orderData.delivery_notes) formData.append('delivery_notes', orderData.delivery_notes);

    // Payment
    if (orderData.payment_method) formData.append('payment_method', orderData.payment_method);

    // Guest checkout
    if (orderData.is_guest) formData.append('is_guest', orderData.is_guest);

    const response = await axiosInstance.post('/submit-order.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Order submitted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    throw error;
  }
};

/**
 * GET ORDER DETAILS
 * GET /api/order-details.php?id={order_id}
 * @param {string|number} orderId - Order ID
 * @returns {Promise} Order details with items
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/order-details.php?id=${orderId}`);
    console.log('✅ Order details fetched:', orderId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    throw error;
  }
};

/**
 * GET USER ORDERS
 * GET /api/orders.php or from dashboard
 * @param {Object} params - Optional params { status, limit, offset }
 * @returns {Promise} List of user orders
 */
export const getUserOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/orders.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ User orders fetched:', response.data?.orders?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    throw error;
  }
};

/**
 * GET ORDER BY ID
 * Alias for getOrderDetails
 * @param {string|number} orderId - Order ID
 * @returns {Promise} Order details
 */
export const getOrderById = async (orderId) => {
  return getOrderDetails(orderId);
};

/**
 * TRACK ORDER
 * GET /api/track-order.php?id={order_id}
 * @param {string|number} orderId - Order ID
 * @returns {Promise} Order tracking information
 */
export const trackOrder = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/track-order.php?id=${orderId}`);
    console.log('✅ Order tracking fetched:', orderId);
    return response;
  } catch (error) {
    console.error('❌ Error tracking order:', error);
    throw error;
  }
};

/**
 * GET ORDER CONFIRMATION
 * GET /api/order-confirmation.php?order_id={id}
 * @param {string|number} orderId - Order ID
 * @returns {Promise} Order confirmation details
 */
export const getOrderConfirmation = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/order-confirmation.php?order_id=${orderId}`);
    console.log('✅ Order confirmation fetched:', orderId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching order confirmation:', error);
    throw error;
  }
};

/**
 * GET PENDING ORDERS
 * Helper to get orders with pending status
 * @returns {Promise} List of pending orders
 */
export const getPendingOrders = async () => {
  return getUserOrders({ status: 'pending' });
};

/**
 * GET COMPLETED ORDERS
 * Helper to get orders with completed/delivered status
 * @returns {Promise} List of completed orders
 */
export const getCompletedOrders = async () => {
  return getUserOrders({ status: 'completed' });
};

/**
 * GET ORDER HISTORY
 * Alias for getUserOrders
 * @param {number} limit - Optional limit
 * @returns {Promise} Order history
 */
export const getOrderHistory = async (limit = 20) => {
  return getUserOrders({ limit });
};

/**
 * CANCEL ORDER
 * POST /api/cancel-order.php
 * @param {string|number} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} Response confirming cancellation
 */
export const cancelOrder = async (orderId, reason = '') => {
  try {
    console.log('❌ Cancelling order:', orderId);

    const formData = new URLSearchParams();
    formData.append('order_id', orderId);
    if (reason) formData.append('reason', reason);

    const response = await axiosInstance.post('/api/cancel-order.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Order cancelled successfully');
    return response;
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    throw error;
  }
};

/**
 * REORDER
 * POST /api/reorder.php
 * @param {string|number} orderId - Previous order ID to reorder
 * @returns {Promise} Response with items added to cart
 */
export const reorder = async (orderId) => {
  try {
    console.log('🔄 Reordering:', orderId);

    const formData = new URLSearchParams();
    formData.append('order_id', orderId);

    const response = await axiosInstance.post('/api/reorder.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Items added to cart from previous order');
    return response;
  } catch (error) {
    console.error('❌ Error reordering:', error);
    throw error;
  }
};

/**
 * CALCULATE ORDER TOTAL
 * Helper to calculate total from order items
 * @param {Array} items - Order items with price and quantity
 * @param {number} deliveryCharge - Delivery charge
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (items, deliveryCharge = 0) => {
  if (!items || !Array.isArray(items)) {
    return deliveryCharge;
  }

  const subtotal = items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  return subtotal + deliveryCharge;
};

/**
 * FORMAT ORDER STATUS
 * Helper to format order status for display
 * @param {string} status - Order status from backend
 * @returns {string} Formatted status
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'on_the_way': 'On the Way',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
  };

  return statusMap[status] || status;
};

/**
 * GET ORDER STATUS COLOR
 * Helper to get color for order status badge
 * @param {string} status - Order status
 * @returns {string} Color code
 */
export const getOrderStatusColor = (status) => {
  const colorMap = {
    'pending': '#FFA500',      // Orange
    'confirmed': '#4CAF50',    // Green
    'preparing': '#2196F3',    // Blue
    'on_the_way': '#9C27B0',   // Purple
    'delivered': '#4CAF50',    // Green
    'cancelled': '#F44336',    // Red
  };

  return colorMap[status] || '#757575'; // Default gray
};

// Alias for backward compatibility
export const createOrder = submitOrder;

export default {
  submitOrder,
  getOrderDetails,
  getUserOrders,
  getOrderById,
  trackOrder,
  getOrderConfirmation,
  getPendingOrders,
  getCompletedOrders,
  getOrderHistory,
  cancelOrder,
  reorder,
  calculateOrderTotal,
  formatOrderStatus,
  getOrderStatusColor,
  // Aliases
  createOrder,
};
