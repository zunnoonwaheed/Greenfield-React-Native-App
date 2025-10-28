import axiosInstance from './axiosConfig';

/**
 * Product API Module
 * Handles all product-related API calls
 */

/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters { limit, offset, category_id, search }
 * @returns {Promise} - Response with products array
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array as fallback for now
    return [];
  }
};

/**
 * Get a single product by ID
 * @param {string|number} productId - Product ID
 * @returns {Promise} - Response with product data
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Search products by query
 * @param {string} query - Search query
 * @param {Object} params - Additional query parameters
 * @returns {Promise} - Response with matching products
 */
export const searchProducts = async (query, params = {}) => {
  try {
    const response = await axiosInstance.get('/products/search', {
      params: { q: query, ...(params || {}) },
    });
    return response;
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Get products by category
 * @param {string|number} categoryId - Category ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise} - Response with products in category
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/products/category/${categoryId}`, { params });
    return response;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Get featured/recommended products
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with featured products
 */
export const getFeaturedProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/products/featured', { params });
    return response;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};
