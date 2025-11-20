import axiosInstance from './axiosConfig';

/**
 * Forgot Password
 * POST /api/forgot-password.php
 */
export const forgotPassword = async (email) => {
  try {
    console.log('📧 Requesting password reset for:', email);

    const formData = new URLSearchParams();
    formData.append('email', email);

    const response = await axiosInstance.post('/api/forgot-password.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Password reset email sent');
    return response;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

export default forgotPassword;
