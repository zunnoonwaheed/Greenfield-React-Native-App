import axiosInstance from './axiosConfig';

/**
 * Change Password
 * POST /api/change-password.php
 */
export const changePassword = async (passwordData) => {
  try {
    console.log('🔐 Changing password');

    const formData = new URLSearchParams();
    formData.append('current_password', passwordData.current_password);
    formData.append('new_password', passwordData.new_password);
    if (passwordData.confirm_password) {
      formData.append('confirm_password', passwordData.confirm_password);
    }

    const response = await axiosInstance.post('/api/change-password.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Password changed successfully');
    return response;
  } catch (error) {
    console.error('❌ Error changing password:', error);
    throw error;
  }
};

export default changePassword;
