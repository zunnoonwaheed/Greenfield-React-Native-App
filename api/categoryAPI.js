import axiosInstance from './axiosConfig';

/**
 * Category API Module
 * Handles all category-related API calls
 */

/**
 * Get all categories
 * @param {Object} params - Query parameters { parent_id, limit }
 * @returns {Promise} - Response with categories array
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/categories', { params });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Get a single category by ID
 * @param {string|number} categoryId - Category ID
 * @returns {Promise} - Response with category data
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

/**
 * Get subcategories for a parent category
 * @param {string|number} parentId - Parent category ID
 * @returns {Promise} - Response with subcategories
 */
export const getSubcategories = async (parentId) => {
  try {
    const response = await axiosInstance.get(`/categories/${parentId}/subcategories`);
    return response;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};
