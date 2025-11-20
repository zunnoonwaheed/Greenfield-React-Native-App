import axiosInstance from './axiosConfig';

/**
 * Get Dashboard Data
 * GET /api/dashboard.php
 */
export const getDashboard = async () => {
  try {
    const response = await axiosInstance.get('/api/dashboard.php');

    console.log('✅ Dashboard data fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    throw error;
  }
};

export default getDashboard;
