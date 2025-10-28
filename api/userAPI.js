// ============================================
// USER API
// All user profile-related API calls
// ============================================

import axiosInstance, { setUserData } from './axiosConfig';

/**
 * GET PROFILE - Fetch current user profile
 * @returns {Promise} User profile data
 *
 * Usage:
 * const response = await getProfile();
 * console.log(response.user);
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');

    // Response interceptor returns response.data, so access properties directly
    if (response && response.success && response.user) {
      // Update stored user data
      await setUserData(response.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * UPDATE PROFILE - Update user information
 * @param {Object} profileData - { name, phone }
 * @returns {Promise} Updated user data
 * 
 * Usage:
 * const response = await updateProfile({
 *   name: 'John Updated',
 *   phone: '+923001234567'
 * });
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/user/profile', profileData);

    // Response interceptor returns response.data, so access properties directly
    if (response && response.success && response.user) {
      // Update stored user data
      await setUserData(response.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * CHANGE PASSWORD - Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await changePassword('oldPass123', 'newPass456');
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.post('/user/change-password', {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE ACCOUNT - Soft delete user account
 * @returns {Promise} API response
 * 
 * Usage:
 * const response = await deleteAccount();
 */
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/user/account');
    
    if (response.success) {
      // Clear local storage
      const { removeAuthToken } = await import('./axiosConfig');
      await removeAuthToken();
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};