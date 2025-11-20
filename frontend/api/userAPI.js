// ============================================
// USER API - PHP BACKEND
// All user profile and notification-related API calls
// ============================================

import axiosInstance, { setUserData, removeAuthToken } from './axiosConfig';

/**
 * GET USER PROFILE
 * GET /api/profile.php
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/profile.php');
    console.log('✅ Profile fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    throw error;
  }
};

/**
 * GET USER DASHBOARD
 * GET /api/dashboard.php
 * @returns {Promise} Dashboard data with orders, profile, and stats
 */
export const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get('/api/dashboard.php');
    console.log('✅ Dashboard data fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * UPDATE PROFILE
 * POST /api/update-profile.php
 * @param {Object} profileData - { name, phone, email, address }
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    console.log('👤 Updating profile:', profileData);

    const formData = new URLSearchParams();
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.phone) formData.append('phone', profileData.phone);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.address) formData.append('address', profileData.address);

    const response = await axiosInstance.post('/api/update-profile.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Profile updated successfully');

    // Update stored user data if response includes updated user info
    if (response.success && response.data && response.data.user) {
      await setUserData(response.data.user);
    }

    return response;
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    throw error;
  }
};

/**
 * CHANGE PASSWORD
 * POST /api/change-password.php
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    console.log('🔑 Changing password');

    const formData = new URLSearchParams();
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);

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

/**
 * GET USER NOTIFICATIONS
 * GET /api/notifications.php
 * @param {Object} params - Optional params { limit, offset, unread_only }
 * @returns {Promise} List of user notifications
 */
export const getNotifications = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.unread_only) queryParams.append('unread_only', params.unread_only);

    const url = `/api/notifications.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Notifications fetched:', response.data?.notifications?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    throw error;
  }
};

/**
 * GET UNREAD NOTIFICATIONS COUNT
 * GET /api/notifications.php?count_only=true
 * @returns {Promise<number>} Count of unread notifications
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await axiosInstance.get('/api/notifications.php?count_only=true');

    if (response.success && response.data) {
      return response.data.unread_count || 0;
    }

    return 0;
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    return 0;
  }
};

/**
 * MARK NOTIFICATION AS READ
 * POST /api/mark-notification-read.php
 * @param {number|string} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('notification_id', notificationId);

    const response = await axiosInstance.post('/api/mark-notification-read.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Notification marked as read:', notificationId);
    return response;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }
};

/**
 * MARK ALL NOTIFICATIONS AS READ
 * POST /api/mark-all-notifications-read.php
 * @returns {Promise} API response
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.post('/api/mark-all-notifications-read.php');
    console.log('✅ All notifications marked as read');
    return response;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * DELETE NOTIFICATION
 * POST /api/delete-notification.php
 * @param {number|string} notificationId - Notification ID
 * @returns {Promise} API response
 */
export const deleteNotification = async (notificationId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('notification_id', notificationId);

    const response = await axiosInstance.post('/api/delete-notification.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Notification deleted:', notificationId);
    return response;
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    throw error;
  }
};

/**
 * GET NOTIFICATION SETTINGS
 * GET /api/notification-settings.php
 * @returns {Promise} User's notification preferences
 */
export const getNotificationSettings = async () => {
  try {
    const response = await axiosInstance.get('/api/notification-settings.php');
    console.log('✅ Notification settings fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching notification settings:', error);
    throw error;
  }
};

/**
 * UPDATE NOTIFICATION SETTINGS
 * POST /api/update-notification-settings.php
 * @param {Object} settings - Notification preferences
 * @returns {Promise} Updated settings
 */
export const updateNotificationSettings = async (settings) => {
  try {
    const formData = new URLSearchParams();

    // Add all settings to form data
    Object.keys(settings).forEach(key => {
      formData.append(key, settings[key]);
    });

    const response = await axiosInstance.post('/api/update-notification-settings.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Notification settings updated');
    return response;
  } catch (error) {
    console.error('❌ Error updating notification settings:', error);
    throw error;
  }
};

/**
 * DELETE ACCOUNT
 * POST /api/delete-account.php
 * @returns {Promise} API response
 */
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.post('/api/delete-account.php');

    // Clear local auth data
    await removeAuthToken();

    console.log('✅ Account deleted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error deleting account:', error);

    // Still clear local data even if API call fails
    await removeAuthToken();

    throw error;
  }
};

/**
 * GET USER STATS
 * Helper to get user statistics from dashboard
 * @returns {Promise} User stats (total orders, total spent, etc.)
 */
export const getUserStats = async () => {
  try {
    const response = await getDashboardData();

    if (response.success && response.data) {
      return {
        success: true,
        data: {
          total_orders: response.data.total_orders || 0,
          total_spent: response.data.total_spent || 0,
          pending_orders: response.data.pending_orders || 0,
          completed_orders: response.data.completed_orders || 0,
        }
      };
    }

    return {
      success: false,
      data: null
    };
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    throw error;
  }
};

export default {
  getProfile,
  getDashboardData,
  updateProfile,
  changePassword,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  deleteAccount,
  getUserStats,
};
