import axiosInstance from './axiosConfig';

/**
 * Mark All Notifications as Read
 * POST /api/mark-all-notifications-read.php
 */
export const markAllNotificationsRead = async () => {
  try {
    console.log('📬 Marking all notifications as read');

    const response = await axiosInstance.post('/api/mark-all-notifications-read.php', '', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ All notifications marked as read');
    return response;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    throw error;
  }
};

export default markAllNotificationsRead;
