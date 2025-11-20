import axiosInstance, { removeAuthToken } from './axiosConfig';

/**
 * Logout
 * GET /logout.php
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.get('/logout.php');

    await removeAuthToken();

    console.log('✅ Logged out successfully');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    await removeAuthToken();
    console.error('❌ Logout error:', error);

    return {
      success: true,
      message: 'Logged out',
    };
  }
};

export default logout;
