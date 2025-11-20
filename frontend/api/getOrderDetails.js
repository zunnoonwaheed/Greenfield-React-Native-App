import axiosInstance from './axiosConfig';

/**
 * Get Order Details
 * GET /api/order-details.php?order_id={id}
 */
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/order-details.php?order_id=${orderId}`);

    console.log('✅ Order details fetched for order:', orderId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    throw error;
  }
};

export default getOrderDetails;
