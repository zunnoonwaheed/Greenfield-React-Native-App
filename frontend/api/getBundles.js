import axiosInstance from './axiosConfig';

/**
 * Get All Bundles
 * GET /api/bundles.php
 */
export const getAllBundles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.active_only) queryParams.append('active_only', params.active_only);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/bundles.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Bundles fetched:', response.data?.bundles?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching bundles:', error);
    throw error;
  }
};

/**
 * Get Featured Bundles
 * GET /api/bundles.php?featured=true
 */
export const getFeaturedBundles = async (limit = 10) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('featured', 'true');
    if (limit) queryParams.append('limit', limit);

    const url = `/api/bundles.php?${queryParams.toString()}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Featured bundles fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching featured bundles:', error);
    throw error;
  }
};

export default getAllBundles;
