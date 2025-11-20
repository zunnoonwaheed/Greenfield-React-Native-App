// ============================================
// PRODUCT API - PHP BACKEND
// All product-related API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET ALL PRODUCTS
 * GET /api/products.php
 * @param {Object} params - { category_id, brand_id, search, limit, offset }
 * @returns {Promise} List of products
 */
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.brand_id) queryParams.append('brand_id', params.brand_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/products.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Products fetched:', response.data?.products?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

/**
 * GET PRODUCT BY ID
 * GET /api/product.php?id={id}
 * @param {string|number} productId - Product ID
 * @returns {Promise} Product details
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/product.php?id=${productId}`);
    console.log('✅ Product fetched by ID:', productId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * GET PRODUCT BY SLUG
 * GET /api/product.php?slug={slug}
 * @param {string} slug - Product slug
 * @returns {Promise} Product details
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/product.php?slug=${slug}`);
    console.log('✅ Product fetched by slug:', slug);
    return response;
  } catch (error) {
    console.error('❌ Error fetching product by slug:', error);
    throw error;
  }
};

/**
 * SEARCH PRODUCTS
 * POST /api/search-products.php
 * @param {string} query - Search query
 * @returns {Promise} Search results
 */
export const searchProducts = async (query) => {
  try {
    const formData = new URLSearchParams();
    formData.append('q', query);

    const response = await axiosInstance.post('/search-product.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Search completed for:', query);
    return response;
  } catch (error) {
    console.error('❌ Error searching products:', error);
    throw error;
  }
};

/**
 * GET PRODUCTS BY CATEGORY
 * GET /api/products.php?category_id={id}
 * @param {string|number} categoryId - Category ID
 * @returns {Promise} List of products in category
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/api/products.php?category_id=${categoryId}`);
    console.log('✅ Products fetched for category:', categoryId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    throw error;
  }
};

/**
 * GET PRODUCTS BY BRAND
 * GET /api/products.php?brand_id={id}
 * @param {string|number} brandId - Brand ID
 * @returns {Promise} List of products from brand
 */
export const getProductsByBrand = async (brandId) => {
  try {
    const response = await axiosInstance.get(`/api/products.php?brand_id=${brandId}`);
    console.log('✅ Products fetched for brand:', brandId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching products by brand:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand,
};
