import axiosInstance from './axiosConfig';

/**
 * Reset Password
 * POST /api/reset-password.php
 */
export const resetPassword = async (resetData) => {
  try {
    console.log('🔐 Resetting password');

    const formData = new URLSearchParams();
    formData.append('token', resetData.token);
    formData.append('password', resetData.password);
    if (resetData.confirm_password) {
      formData.append('confirm_password', resetData.confirm_password);
    }

    const response = await axiosInstance.post('/api/reset-password.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Password reset successfully');
    return response;
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    throw error;
  }
};

export default resetPassword;
