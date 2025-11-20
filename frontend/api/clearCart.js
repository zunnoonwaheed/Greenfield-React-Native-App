import axiosInstance from './axiosConfig';

/**
 * Clear Cart
 * GET /clear-cart.php
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.get('/clear-cart.php');
    console.log('✅ Cart cleared successfully');
    return response;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    throw error;
  }
};

export default clearCart;
