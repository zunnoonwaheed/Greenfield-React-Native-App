// ============================================
// AUTHENTICATION API - UPDATED FOR JSON BACKEND
// All auth-related API calls for PHP backend
// Backend uses SESSION-based authentication
// All endpoints return JSON responses
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { setUserData, removeAuthToken, setAuthToken } from './axiosConfig';

/**
 * LOGIN - Authenticate user with session
 * POST /login.php
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response with user data
 */
export const login = async (email, password) => {
  try {
    console.log('============================================');
    console.log('[CLIENT] Login attempt');
    console.log('[CLIENT] Email:', email.trim());
    console.log('============================================');

    // PHP backend expects form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('email', email.trim());
    formData.append('password', password);

    const response = await axiosInstance.post('/login.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('[CLIENT] Response:', response);

    // Backend returns JSON: { success: true, message: '...', data: { user: {...}, session_id: '...' } }
    if (response.success && response.data && response.data.user) {
      const user = response.data.user;

      // Store auth flag, user data, and session ID
      await setAuthToken('logged_in');
      await setUserData(user);

      // Store session ID if provided
      if (response.data.session_id) {
        await AsyncStorage.setItem('sessionId', response.data.session_id);
        console.log('🔑 Session ID stored:', response.data.session_id);
      }

      console.log('[CLIENT] ✅ Login successful');

      return {
        success: true,
        message: response.message || 'Login successful',
        user: user
      };
    }

    // If response doesn't have expected structure, throw error
    throw new Error(response.error || response.message || 'Login failed');

  } catch (error) {
    console.error('[CLIENT] ❌ Login error:', error);

    // Extract error message
    let errorMessage = 'Login failed. Please try again.';

    if (error.response) {
      // Server responded with error
      if (error.response.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * REGISTER - Create new user account
 * POST /api/register.php
 * @param {Object} userData - User registration data
 * @returns {Promise} API response
 */
export const signup = async (userData) => {
  try {
    console.log('📦 Registration attempt');

    // PHP backend expects form-urlencoded data
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

    // Backend returns JSON: { success: true, message: '...', data: { user: {...} } }
    if (response.success) {
      // DO NOT auto-login - user must login manually after signup
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

/**
 * LOGOUT - Clear session and user data
 * GET /logout.php
 * @returns {Promise} API response
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.get('/logout.php');

    // Remove stored user data
    await removeAuthToken();

    console.log('✅ Logged out successfully');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    // Even if API call fails, remove local data
    await removeAuthToken();
    console.error('❌ Logout error:', error);

    // Don't throw error on logout
    return {
      success: true,
      message: 'Logged out',
    };
  }
};

/**
 * GET USER PROFILE - Fetch current user profile
 * GET /api/profile.php
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/profile.php');

    console.log('✅ Profile fetched');

    if (response.success && response.data && response.data.user) {
      return {
        success: true,
        user: response.data.user
      };
    }

    throw new Error('Failed to fetch profile');
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    throw error;
  }
};

/**
 * FORGOT PASSWORD - Request password reset
 * POST /api/forgot-password.php
 * @param {string} email - User email
 * @returns {Promise} API response
 */
export const forgotPassword = async (email) => {
  try {
    console.log('📧 Forgot password request for:', email);

    const formData = new URLSearchParams();
    formData.append('email', email.trim());

    const response = await axiosInstance.post('/api/forgot-password.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('📧 Forgot password response:', response);

    if (response.success) {
      return {
        success: true,
        message: response.message || 'Password reset link sent to your email',
        // In development, backend returns token for testing
        token: response.data?.reset_token,
      };
    }

    throw new Error(response.error || response.message || 'Failed to send reset link');

  } catch (error) {
    console.error('❌ Forgot password error:', error);

    let errorMessage = 'Failed to send reset link. Please try again.';

    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * RESET PASSWORD - Reset password with token
 * POST /api/reset-password.php
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    console.log('🔑 Reset password attempt');

    const formData = new URLSearchParams();
    formData.append('token', token);
    formData.append('new_password', newPassword);

    const response = await axiosInstance.post('/api/reset-password.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('🔑 Reset password response:', response);

    if (response.success) {
      return {
        success: true,
        message: response.message || 'Password reset successful. Please login with your new password.',
      };
    }

    throw new Error(response.error || response.message || 'Failed to reset password');

  } catch (error) {
    console.error('❌ Reset password error:', error);

    let errorMessage = 'Failed to reset password. Please try again.';

    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * CHECK AUTH STATUS - Verify if user is authenticated
 * @returns {boolean} True if session exists
 */
export const checkAuthStatus = async () => {
  try {
    // Try to get user profile to check if session is valid
    const response = await axiosInstance.get('/api/profile.php');

    if (response.success) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export default {
  login,
  signup,
  logout,
  getUserProfile,
  forgotPassword,
  resetPassword,
  checkAuthStatus,
};
