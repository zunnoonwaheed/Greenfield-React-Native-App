/**
 * Ad API Module
 * API calls for marketplace ads
 */

import axiosInstance from './axiosConfig';

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/ads/categories');
    return response;
  } catch (error) {
    console.error('Get categories error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get subcategories for a category
 */
export const getSubcategories = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/ads/categories/${categoryId}/subcategories`);
    return response;
  } catch (error) {
    console.error('Get subcategories error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new ad
 */
export const createAd = async (adData) => {
  try {
    const response = await axiosInstance.post('/ads', adData);
    return response;
  } catch (error) {
    console.error('Create ad error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all ads
 */
export const getAds = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/ads', { params });
    return response;
  } catch (error) {
    console.error('Get ads error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get ad by ID
 */
export const getAdById = async (id) => {
  try {
    const response = await axiosInstance.get(`/ads/${id}`);
    return response;
  } catch (error) {
    console.error('Get ad error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current user's ads
 */
export const getMyAds = async () => {
  try {
    const response = await axiosInstance.get('/ads/my/ads');
    return response;
  } catch (error) {
    console.error('Get my ads error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an ad
 */
export const updateAd = async (id, adData) => {
  try {
    const response = await axiosInstance.put(`/ads/${id}`, adData);
    return response;
  } catch (error) {
    console.error('Update ad error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete an ad
 */
export const deleteAd = async (id) => {
  try {
    const response = await axiosInstance.delete(`/ads/${id}`);
    return response;
  } catch (error) {
    console.error('Delete ad error:', error.response?.data || error.message);
    throw error;
  }
};
