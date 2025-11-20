import { getCartContents } from './getCartContents';

/**
 * Get Cart Count
 * Helper function to get total number of items in cart
 */
export const getCartCount = async () => {
  try {
    const response = await getCartContents();
    if (response.success && response.data) {
      return response.data.count || 0;
    }
    return 0;
  } catch (error) {
    console.error('❌ Error getting cart count:', error);
    return 0;
  }
};

export default getCartCount;
