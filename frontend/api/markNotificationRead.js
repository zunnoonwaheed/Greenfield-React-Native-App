import axiosInstance from './axiosConfig';

/**
 * Mark Notification as Read
 * POST /api/mark-notification-read.php
 */
export const markNotificationRead = async (notificationId) => {
  try {
    console.log('📬 Marking notification as read:', notificationId);

    const formData = new URLSearchParams();
    formData.append('notification_id', notificationId);

    const response = await axiosInstance.post('/api/mark-notification-read.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Notification marked as read');
    return response;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }
};

export default markNotificationRead;
