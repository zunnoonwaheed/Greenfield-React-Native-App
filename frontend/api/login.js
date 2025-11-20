import axiosInstance, { setUserData, setAuthToken } from './axiosConfig';

/**
 * Login
 * POST /login.php
 */
export const login = async (email, password) => {
  try {
    console.log('============================================');
    console.log('[CLIENT] Login attempt');
    console.log('[CLIENT] Email:', email.trim());
    console.log('============================================');

    const formData = new URLSearchParams();
    formData.append('email', email.trim());
    formData.append('password', password);

    const response = await axiosInstance.post('/login.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('[CLIENT] Response:', response);

    if (response.success && response.data && response.data.user) {
      const user = response.data.user;

      await setAuthToken('logged_in');
      await setUserData(user);

      console.log('[CLIENT] ✅ Login successful');

      return {
        success: true,
        message: response.message || 'Login successful',
        user: user
      };
    }

    throw new Error(response.error || response.message || 'Login failed');

  } catch (error) {
    console.error('[CLIENT] ❌ Login error:', error);

    let errorMessage = 'Login failed. Please try again.';

    if (error.response) {
      if (error.response.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export default login;
