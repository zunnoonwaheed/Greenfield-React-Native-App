// ============================================
// CATEGORY API - PHP BACKEND
// All category-related API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET ALL CATEGORIES
 * GET /api/categories.php
 * @returns {Promise} List of all categories
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
 * GET CATEGORY BY ID
 * GET /api/category.php?id={id}
 * @param {string|number} categoryId - Category ID
 * @returns {Promise} Category details with products
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/api/category.php?id=${categoryId}`);
    console.log('✅ Category fetched by ID:', categoryId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching category by ID:', error);
    throw error;
  }
};

/**
 * GET CATEGORY BY SLUG
 * GET /api/category.php?slug={slug}
 * @param {string} slug - Category slug
 * @returns {Promise} Category details with products
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/category.php?slug=${slug}`);
    console.log('✅ Category fetched by slug:', slug);
    return response;
  } catch (error) {
    console.error('❌ Error fetching category by slug:', error);
    throw error;
  }
};

/**
 * GET SUBCATEGORIES
 * GET /api/categories.php (filtered client-side by parent_id)
 * @param {string|number} parentId - Parent category ID
 * @returns {Promise} List of subcategories
 */
export const getSubcategories = async (parentId) => {
  try {
    const response = await getCategories();

    if (response.success && response.data && response.data.categories) {
      const subcategories = response.data.categories.filter(
        cat => cat.parent_id === parseInt(parentId)
      );

      console.log('✅ Subcategories fetched for parent:', parentId);

      return {
        success: true,
        data: { categories: subcategories }
      };
    }

    return { success: false, data: { categories: [] } };
  } catch (error) {
    console.error('❌ Error fetching subcategories:', error);
    throw error;
  }
};

/**
 * GET CATEGORY PRODUCTS
 * Uses product API with category filter
 * GET /api/products.php?category_id={id}
 * @param {string|number} categoryId - Category ID
 * @param {Object} params - Optional params { brand_id, search, limit, offset }
 * @returns {Promise} Products in category
 */
export const getCategoryProducts = async (categoryId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('category_id', categoryId);

    if (params.brand_id) queryParams.append('brand_id', params.brand_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/products.php?${queryParams.toString()}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Category products fetched:', categoryId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching category products:', error);
    throw error;
  }
};

/**
 * GET TOP-LEVEL CATEGORIES
 * GET /api/categories.php (filtered client-side for parent_id = null/0)
 * @returns {Promise} List of top-level categories
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

export default {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getSubcategories,
  getCategoryProducts,
  getTopLevelCategories,
};
