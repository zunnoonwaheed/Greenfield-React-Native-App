import axiosInstance from './axiosConfig';

/**
 * Register / Signup
 * POST /api/register.php
 */
export const signup = async (userData) => {
  try {
    console.log('📦 Registration attempt');

    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address || '');

    const response = await axiosInstance.post('/api/register.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('📦 Registration response:', response);

    if (response.success) {
      console.log('✅ Registration successful - redirecting to login');

      return {
        success: true,
        message: response.message || 'Registration successful. Please login.',
        user: response.data?.user || null
      };
    }

    throw new Error(response.error || response.message || 'Registration failed');

  } catch (error) {
    console.error('❌ Registration error:', error);

    let errorMessage = 'Registration failed. Please try again.';

    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export default signup;
