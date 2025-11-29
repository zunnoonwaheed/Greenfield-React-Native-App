import axiosInstance from './axiosConfig';

/**
 * Update User Address
 * POST /api/update-address.php
 * @param {string} address - The new address
 * @returns {Promise} API response
 */
export const updateAddress = async (address) => {
  try {
    console.log('📍 Updating address:', address);

    const formData = new URLSearchParams();
    formData.append('address', address);

    const response = await axiosInstance.post('/api/update-address.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Address updated successfully');
    return response;
  } catch (error) {
    console.error('❌ Error updating address:', error);
    throw error;
  }
};

export default updateAddress;
