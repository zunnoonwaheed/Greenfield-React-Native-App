import axiosInstance from './axiosConfig';

/**
 * Get User Profile
 * GET /api/profile.php
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/profile.php');
    console.log('✅ Profile fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    throw error;
  }
};

export default getProfile;
