import axiosInstance from './axiosConfig';

/**
 * Advertisement API Module
 * Handles marketplace ad listings (user-created ads for selling items)
 *
 * ⚠️ IMPORTANT: Marketplace feature is NOT available in PHP backend
 * This module is kept for future implementation or if you add marketplace to PHP
 * All functions will return placeholder/error responses
 */

/**
 * Create a new ad listing
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {Object} adData - Ad data { title, description, price, category_id, images, etc. }
 * @returns {Promise} - Response with created ad
 */
export const createAd = async (adData) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  throw new Error('Marketplace feature is not available. This feature requires backend support.');
};

/**
 * Get all ads with optional filters
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {Object} params - Query parameters { category_id, search, location, limit, offset }
 * @returns {Promise} - Response with ads array
 */
export const getAllAds = async (params = {}) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  return [];
};

/**
 * Get ads created by the authenticated user
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {Object} params - Query parameters { status, limit, offset }
 * @returns {Promise} - Response with user's ads
 */
export const getUserAds = async (params = {}) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  return [];
};

/**
 * Get a single ad by ID
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response with ad details
 */
export const getAdById = async (adId) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  throw new Error('Marketplace feature is not available');
};

/**
 * Update an existing ad
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {string|number} adId - Ad ID
 * @param {Object} adData - Updated ad data
 * @returns {Promise} - Response with updated ad
 */
export const updateAd = async (adId, adData) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  throw new Error('Marketplace feature is not available');
};

/**
 * Delete an ad
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response confirming deletion
 */
export const deleteAd = async (adId) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  throw new Error('Marketplace feature is not available');
};

/**
 * Mark ad as sold
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response confirming status update
 */
export const markAdAsSold = async (adId) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  throw new Error('Marketplace feature is not available');
};

/**
 * Search ads by query
 * ⚠️ NOT AVAILABLE - PHP backend does not have marketplace endpoints
 * @param {string} query - Search query
 * @param {Object} params - Additional filters
 * @returns {Promise} - Response with matching ads
 */
export const searchAds = async (query, params = {}) => {
  console.warn('⚠️ Marketplace feature not available in PHP backend');
  return [];
};
