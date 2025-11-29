/**
 * Payment Methods API Module
 * Manage user payment methods
 */

import axiosInstance from './axiosConfig';

/**
 * Get all payment methods for the authenticated user
 * @returns {Promise<Object>} { success, data: { payment_methods } }
 */
export const getPaymentMethods = async () => {
  try {
    const response = await axiosInstance.get('/api/payment-methods.php');
    return response; // Don't wrap again - already has success and data
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch payment methods'
    };
  }
};

/**
 * Add a new payment method
 * @param {Object} paymentData - Payment method data
 * @returns {Promise<Object>} { success, data: { message, payment_method } }
 */
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/api/payment-methods.php', paymentData);
    return response; // Don't wrap again - already has success and data
  } catch (error) {
    console.error('Error adding payment method:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to add payment method'
    };
  }
};

/**
 * Delete a payment method
 * @param {number} methodId - Payment method ID
 * @returns {Promise<Object>} { success, data: { message } }
 */
export const deletePaymentMethod = async (methodId) => {
  try {
    const response = await axiosInstance.delete('/api/delete-payment-method.php', {
      params: { id: methodId }
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to delete payment method'
    };
  }
};

/**
 * Set a payment method as default
 * @param {number} methodId - Payment method ID
 * @returns {Promise<Object>} { success, data: { message } }
 */
export const setDefaultPaymentMethod = async (methodId) => {
  try {
    const response = await axiosInstance.post('/api/set-default-payment.php', {
      id: methodId
    });
    return response;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to set default payment method'
    };
  }
};

export default {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
};
