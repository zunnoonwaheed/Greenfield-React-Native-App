import axiosInstance from './axiosConfig';

/**
 * Get Bundle by ID
 * GET /api/bundle.php?id={id}
 */
export const getBundleById = async (bundleId) => {
  try {
    const response = await axiosInstance.get(`/api/bundle.php?id=${bundleId}`);
    console.log('✅ Bundle fetched by ID:', bundleId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching bundle by ID:', error);
    throw error;
  }
};

export default getBundleById;
