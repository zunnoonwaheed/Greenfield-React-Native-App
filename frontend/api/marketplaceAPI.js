/**
 * Marketplace/Ads API Module
 * All marketplace and classified ads related endpoints
 */

import axiosInstance from './axiosConfig';

/**
 * Get all marketplace ads with filters
 * @param {Object} params - Query parameters (page, limit, category, condition, search, featured)
 * @returns {Promise<Object>} { success, data: { ads, pagination } }
 */
export const getAds = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/ads.php', { params });
    // Response interceptor already returns response.data, which contains {success, data: {ads, pagination}}
    // So response is already the full API response
    if (response.success && response.data) {
      return { success: true, data: response.data }; // Return response.data which contains {ads, pagination}
    }
    return response;
  } catch (error) {
    console.error('Error fetching ads:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch ads'
    };
  }
};

/**
 * Get detailed information about a specific ad
 * @param {number} adId - Ad ID
 * @returns {Promise<Object>} { success, data: ad }
 */
export const getAdDetail = async (adId) => {
  try {
    const response = await axiosInstance.get('/api/ad-detail.php', {
      params: { id: adId }
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching ad detail:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch ad details'
    };
  }
};

/**
 * Create a new marketplace ad
 * @param {Object} adData - Ad information
 * @returns {Promise<Object>} { success, data: { message, ad } }
 */
export const createAd = async (adData) => {
  try {
    const response = await axiosInstance.post('/api/create-ad.php', adData);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error creating ad:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to create ad'
    };
  }
};

/**
 * Delete an ad (soft delete)
 * @param {number} adId - Ad ID to delete
 * @returns {Promise<Object>} { success, data: { message } }
 */
export const deleteAd = async (adId) => {
  try {
    const response = await axiosInstance.delete('/api/delete-ad.php', {
      params: { id: adId }
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error deleting ad:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to delete ad'
    };
  }
};

/**
 * Get user's own ads
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} { success, data: { ads, pagination } }
 */
export const getMyAds = async (params = {}) => {
  try {
    // The backend will automatically filter by authenticated user via user_id query param
    const response = await axiosInstance.get('/api/ads.php', {
      params: { ...params, user_id: 'me' } // Backend auth middleware will resolve this
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching my ads:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to fetch your ads'
    };
  }
};

/**
 * Search ads
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} { success, data: { ads, pagination } }
 */
export const searchAds = async (query, filters = {}) => {
  return getAds({ ...filters, search: query });
};

/**
 * Upload an image for an ad
 * @param {string} imageUri - Local image URI from ImagePicker
 * @returns {Promise<Object>} { success, data: { image_url } }
 */
export const uploadAdImage = async (imageUri) => {
  try {
    // Create form data for multipart upload
    const formData = new FormData();

    // Get filename and type from URI
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    const response = await axiosInstance.post('/api/upload-ad-image.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to upload image'
    };
  }
};

export default {
  getAds,
  getAdDetail,
  createAd,
  deleteAd,
  getMyAds,
  searchAds,
  uploadAdImage
};
