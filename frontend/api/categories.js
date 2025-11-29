import axiosInstance from './axiosConfig';

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const data = await axiosInstance.get('/api/categories.php');
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: error.message };
  }
};
