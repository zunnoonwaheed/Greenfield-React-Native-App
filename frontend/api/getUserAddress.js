import axiosInstance from './axiosConfig';

/**
 * Get User Address
 * GET /api/profile.php
 */
export const getUserAddress = async () => {
  try {
    const response = await axiosInstance.get('/api/profile.php');

    console.log('✅ User address fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching user address:', error);
    throw error;
  }
};

export default getUserAddress;
