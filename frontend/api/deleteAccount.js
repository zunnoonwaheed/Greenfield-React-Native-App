import axiosInstance, { removeAuthToken, setUserData } from './axiosConfig';

/**
 * Delete Account
 * POST /api/delete-account.php
 */
export const deleteAccount = async (passwordData) => {
  try {
    console.log('🗑️ Deleting account');

    const formData = new URLSearchParams();
    if (passwordData && passwordData.password) {
      formData.append('password', passwordData.password);
    }

    const response = await axiosInstance.post('/api/delete-account.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.success) {
      console.log('✅ Account deleted successfully');
      await removeAuthToken();
      await setUserData(null);
    }

    return response;
  } catch (error) {
    console.error('❌ Error deleting account:', error);
    throw error;
  }
};

export default deleteAccount;
