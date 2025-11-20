import axiosInstance from './axiosConfig';

/**
 * Cancel Order
 * POST /api/cancel-order.php
 */
export const cancelOrder = async (orderId) => {
  try {
    console.log('❌ Cancelling order:', orderId);

    const formData = new URLSearchParams();
    formData.append('order_id', orderId);

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

export default cancelOrder;
