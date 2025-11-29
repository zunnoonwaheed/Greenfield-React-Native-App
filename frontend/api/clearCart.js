import axiosInstance from './axiosConfig';

/**
 * Clear Cart
 * GET /clear-cart.php
 */
export const clearCart = async () => {
  try {
    // Use force-clear to completely wipe session
    const response = await axiosInstance.post('/force-clear-cart.php');
    console.log('✅ Cart and session cleared completely');
    return response;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    throw error;
  }
};

export default clearCart;
