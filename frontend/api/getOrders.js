import axiosInstance from './axiosConfig';

/**
 * Get User Orders
 * GET /api/orders.php
 */
export const getOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/orders.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Orders fetched:', response.data?.orders?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
};

export default getOrders;
