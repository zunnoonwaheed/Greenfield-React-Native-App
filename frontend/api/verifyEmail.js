import axiosInstance from './axiosConfig';

/**
 * Verify Email
 * POST /api/verify-email.php
 */
export const verifyEmail = async (token) => {
  try {
    console.log('✅ Verifying email with token:', token.substring(0, 10) + '...');

    const formData = new URLSearchParams();
    formData.append('token', token);

    const response = await axiosInstance.post('/api/verify-email.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Email verified successfully');
    return response;
  } catch (error) {
    console.error('❌ Error verifying email:', error);
    throw error;
  }
};

export default verifyEmail;
