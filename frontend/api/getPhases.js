import axiosInstance from './axiosConfig';

/**
 * Get All Phases
 * GET /api/locations.php
 */
export const getPhases = async () => {
  try {
    const response = await axiosInstance.get('/api/locations.php');

    console.log('✅ Phases fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching phases:', error);
    throw error;
  }
};

export default getPhases;
