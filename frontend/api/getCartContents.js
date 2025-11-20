import axiosInstance from './axiosConfig';

/**
 * Get Cart Contents
 * GET /cart-contents.php
 */
export const getCartContents = async () => {
  try {
    const response = await axiosInstance.get('/cart-contents.php');
    console.log('✅ Cart contents fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching cart contents:', error);
    throw error;
  }
};

export default getCartContents;
