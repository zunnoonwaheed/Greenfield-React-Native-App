import axiosInstance from './axiosConfig';

/**
 * Advertisement API Module
 * Handles marketplace ad listings (user-created ads for selling items)
 */

/**
 * Create a new ad listing
 * @param {Object} adData - Ad data { title, description, price, category_id, images, etc. }
 * @returns {Promise} - Response with created ad
 */
export const createAd = async (adData) => {
  try {
    const response = await axiosInstance.post('/ads', adData);
    return response;
  } catch (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
};

/**
 * Get all ads with optional filters
 * @param {Object} params - Query parameters { category_id, search, location, limit, offset }
 * @returns {Promise} - Response with ads array
 */
export const getAllAds = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/ads', { params });
    return response;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
};

/**
 * Get ads created by the authenticated user
 * @param {Object} params - Query parameters { status, limit, offset }
 * @returns {Promise} - Response with user's ads
 */
export const getUserAds = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/ads/my-ads', { params });
    return response;
  } catch (error) {
    console.error('Error fetching user ads:', error);
    return [];
  }
};

/**
 * Get a single ad by ID
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response with ad details
 */
export const getAdById = async (adId) => {
  try {
    const response = await axiosInstance.get(`/ads/${adId}`);
    return response;
  } catch (error) {
    console.error('Error fetching ad:', error);
    throw error;
  }
};

/**
 * Update an existing ad
 * @param {string|number} adId - Ad ID
 * @param {Object} adData - Updated ad data
 * @returns {Promise} - Response with updated ad
 */
export const updateAd = async (adId, adData) => {
  try {
    const response = await axiosInstance.put(`/ads/${adId}`, adData);
    return response;
  } catch (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
};

/**
 * Delete an ad
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response confirming deletion
 */
export const deleteAd = async (adId) => {
  try {
    const response = await axiosInstance.delete(`/ads/${adId}`);
    return response;
  } catch (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
};

/**
 * Mark ad as sold
 * @param {string|number} adId - Ad ID
 * @returns {Promise} - Response confirming status update
 */
export const markAdAsSold = async (adId) => {
  try {
    const response = await axiosInstance.post(`/ads/${adId}/mark-sold`);
    return response;
  } catch (error) {
    console.error('Error marking ad as sold:', error);
    throw error;
  }
};

/**
 * Search ads by query
 * @param {string} query - Search query
 * @param {Object} params - Additional filters
 * @returns {Promise} - Response with matching ads
 */
export const searchAds = async (query, params = {}) => {
  try {
    const response = await axiosInstance.get('/ads/search', {
      params: { q: query, ...(params || {}) },
    });
    return response;
  } catch (error) {
    console.error('Error searching ads:', error);
    return [];
  }
};
