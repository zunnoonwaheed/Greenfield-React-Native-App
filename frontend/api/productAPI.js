// ============================================
// PRODUCT API - PHP BACKEND
// All product-related API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET ALL PRODUCTS WITH FILTERS
 * GET /api/products.php
 * @param {Object} params - Filter parameters
 * @param {string} params.category_id - Category ID
 * @param {string} params.brand_id - Brand ID
 * @param {string} params.search - Search query
 * @param {number} params.limit - Results limit
 * @param {number} params.offset - Results offset
 * @param {number} params.price_min - Minimum price
 * @param {number} params.price_max - Maximum price
 * @param {number} params.discount_min - Minimum discount percentage
 * @param {number} params.rating_min - Minimum rating
 * @param {string} params.delivery_type - Delivery type filter
 * @param {string} params.packaging - Packaging type filter
 * @param {string} params.seller - Seller/brand name filter
 * @param {string} params.sort_by - Sort option
 * @returns {Promise} List of products with filter metadata
 */
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Basic filters
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.brand_id) queryParams.append('brand_id', params.brand_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    // Advanced filters
    if (params.price_min !== undefined && params.price_min !== null) {
      queryParams.append('price_min', params.price_min);
    }
    if (params.price_max !== undefined && params.price_max !== null) {
      queryParams.append('price_max', params.price_max);
    }
    if (params.discount_min !== undefined && params.discount_min !== null) {
      queryParams.append('discount_min', params.discount_min);
    }
    if (params.rating_min !== undefined && params.rating_min !== null) {
      queryParams.append('rating_min', params.rating_min);
    }
    if (params.delivery_type) queryParams.append('delivery_type', params.delivery_type);
    if (params.packaging) queryParams.append('packaging', params.packaging);
    if (params.seller) queryParams.append('seller', params.seller);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);

    const url = `/api/products.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('📡 Fetching products with filters:', params);
    const response = await axiosInstance.get(url);

    // axios interceptor returns data directly, so response IS the data object
    console.log('✅ Products fetched:', response?.data?.products?.length || response?.products?.length || 0);
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

/**
 * GET BEST SELLING PRODUCTS
 * GET /api/products.php?sort_by=popular&limit=10
 * @param {number} limit - Number of products to fetch (default: 10)
 * @returns {Promise} List of best-selling products
 */
export const getBestSellingProducts = async (limit = 10) => {
  try {
    const response = await getProducts({
      sort_by: 'popular',
      limit: limit
    });
    return response;
  } catch (error) {
    console.error('❌ Error fetching best-selling products:', error);
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
  getBestSellingProducts,
};
