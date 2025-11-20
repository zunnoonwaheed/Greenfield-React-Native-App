import axiosInstance from './axiosConfig';

/**
 * Get All Categories
 * GET /api/categories.php
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/api/categories.php');
    console.log('✅ Categories fetched:', response.data?.categories?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get Top-Level Categories
 * Filter for parent categories only
 */
export const getTopLevelCategories = async () => {
  try {
    const response = await getCategories();

    if (response.success && response.data && response.data.categories) {
      const topLevel = response.data.categories.filter(
        cat => !cat.parent_id || cat.parent_id === 0 || cat.parent_id === null
      );

      console.log('✅ Top-level categories fetched:', topLevel.length);

      return {
        success: true,
        data: { categories: topLevel }
      };
    }

    return { success: false, data: { categories: [] } };
  } catch (error) {
    console.error('❌ Error fetching top-level categories:', error);
    throw error;
  }
};

export default getCategories;
