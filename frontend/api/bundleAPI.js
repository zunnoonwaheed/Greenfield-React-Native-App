// ============================================
// BUNDLE API - PHP BACKEND
// All bundle-related API calls
// Bundles are product packages with special discounts
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET ALL BUNDLES
 * GET /api/bundles.php
 * @param {Object} params - Optional params { active_only, limit, offset }
 * @returns {Promise} List of all bundles
 */
export const getAllBundles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.active_only) queryParams.append('active_only', params.active_only);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/bundles.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Bundles fetched:', response.data?.bundles?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching bundles:', error);
    throw error;
  }
};

/**
 * GET BUNDLE BY ID
 * GET /api/bundle.php?id={id}
 * @param {string|number} bundleId - Bundle ID
 * @returns {Promise} Bundle details with products
 */
export const getBundleById = async (bundleId) => {
  try {
    const response = await axiosInstance.get(`/api/bundle.php?id=${bundleId}`);
    console.log('✅ Bundle fetched by ID:', bundleId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching bundle by ID:', error);
    throw error;
  }
};

/**
 * GET BUNDLE BY SLUG
 * GET /api/bundle.php?slug={slug}
 * @param {string} slug - Bundle slug
 * @returns {Promise} Bundle details with products
 */
export const getBundleBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/bundle.php?slug=${slug}`);
    console.log('✅ Bundle fetched by slug:', slug);
    return response;
  } catch (error) {
    console.error('❌ Error fetching bundle by slug:', error);
    throw error;
  }
};

/**
 * GET BUNDLE DETAIL - Alias for getBundleById (for backward compatibility)
 * @param {number|string} bundleId - Bundle ID
 * @returns {Promise} Bundle details
 */
export const getBundleDetail = async (bundleId) => {
  return getBundleById(bundleId);
};

/**
 * GET ACTIVE BUNDLES
 * Helper function to get only active bundles
 * @returns {Promise} List of active bundles
 */
export const getActiveBundles = async () => {
  try {
    const response = await getAllBundles({ active_only: true });
    console.log('✅ Active bundles fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching active bundles:', error);
    throw error;
  }
};

/**
 * GET FEATURED BUNDLES
 * GET /api/bundles.php?featured=true
 * @param {number} limit - Optional limit
 * @returns {Promise} List of featured bundles
 */
export const getFeaturedBundles = async (limit = 10) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('featured', 'true');
    if (limit) queryParams.append('limit', limit);

    const url = `/api/bundles.php?${queryParams.toString()}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Featured bundles fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching featured bundles:', error);
    throw error;
  }
};

/**
 * GET BUNDLE PRODUCTS
 * Helper function to get products included in a bundle
 * @param {string|number} bundleId - Bundle ID
 * @returns {Promise} Products in bundle
 */
export const getBundleProducts = async (bundleId) => {
  try {
    const response = await getBundleById(bundleId);

    if (response.success && response.data && response.data.bundle) {
      const products = response.data.bundle.products || [];
      console.log('✅ Bundle products fetched:', products.length);

      return {
        success: true,
        data: { products }
      };
    }

    return { success: false, data: { products: [] } };
  } catch (error) {
    console.error('❌ Error fetching bundle products:', error);
    throw error;
  }
};

/**
 * CALCULATE BUNDLE SAVINGS
 * Helper function to calculate total savings from bundle discount
 * @param {Object} bundle - Bundle object with original_price and discounted_price
 * @returns {number} Savings amount
 */
export const calculateBundleSavings = (bundle) => {
  if (!bundle || !bundle.original_price || !bundle.discounted_price) {
    return 0;
  }

  const savings = parseFloat(bundle.original_price) - parseFloat(bundle.discounted_price);
  return Math.max(0, savings);
};

/**
 * CALCULATE BUNDLE DISCOUNT PERCENTAGE
 * Helper function to calculate discount percentage
 * @param {Object} bundle - Bundle object with original_price and discounted_price
 * @returns {number} Discount percentage (0-100)
 */
export const calculateBundleDiscountPercentage = (bundle) => {
  if (!bundle || !bundle.original_price || !bundle.discounted_price) {
    return 0;
  }

  const originalPrice = parseFloat(bundle.original_price);
  const discountedPrice = parseFloat(bundle.discounted_price);

  if (originalPrice <= 0) {
    return 0;
  }

  const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.max(0, Math.min(100, percentage));
};

export default {
  getAllBundles,
  getBundleById,
  getBundleBySlug,
  getBundleDetail,
  getActiveBundles,
  getFeaturedBundles,
  getBundleProducts,
  calculateBundleSavings,
  calculateBundleDiscountPercentage,
};
