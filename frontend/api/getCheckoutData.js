import axiosInstance from './axiosConfig';

/**
 * Get Checkout Data
 * GET /checkout.php
 */
export const getCheckoutData = async () => {
  try {
    const response = await axiosInstance.get('/checkout.php');

    console.log('✅ Checkout data fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching checkout data:', error);
    throw error;
  }
};

export default getCheckoutData;
