import axiosInstance from './axiosConfig';

/**
 * Get User Notifications
 * GET /api/notifications.php
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
 * Get Unread Notifications Count
 * GET /api/notifications.php?count_only=true
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

export default getNotifications;
