import axiosInstance from './axiosConfig';

/**
 * Get all saved addresses for user
 * GET /api/addresses.php
 */
export const getAddresses = async () => {
  try {
    console.log('📍 Fetching saved addresses...');
    const response = await axiosInstance.get('/api/addresses.php');
    // axios interceptor returns data directly
    const addresses = response?.data?.addresses || response?.addresses || [];
    console.log('✅ Addresses fetched:', addresses.length);
    return { success: response?.success !== false, data: { addresses } };
  } catch (error) {
    console.error('❌ Error fetching addresses:', error);
    throw error;
  }
};

/**
 * Add new address
 * POST /api/addresses.php
 */
export const addAddress = async (addressData) => {
  try {
    console.log('📍 Adding new address:', addressData);

    const formData = new URLSearchParams();
    if (addressData.label) formData.append('label', addressData.label);
    if (addressData.name) formData.append('name', addressData.name);
    if (addressData.address) formData.append('address', addressData.address);
    if (addressData.building_name) formData.append('building_name', addressData.building_name);
    if (addressData.flat) formData.append('flat', addressData.flat);
    if (addressData.floor) formData.append('floor', addressData.floor);
    if (addressData.company_name) formData.append('company_name', addressData.company_name);
    if (addressData.instructions) formData.append('instructions', addressData.instructions);
    if (addressData.is_default !== undefined) formData.append('is_default', addressData.is_default ? '1' : '0');

    const response = await axiosInstance.post('/api/addresses.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Address added successfully:', response);
    // axios interceptor returns data directly
    return { success: response?.success !== false, data: response?.data || response };
  } catch (error) {
    console.error('❌ Error adding address:', error);
    throw error;
  }
};

/**
 * Delete address
 * DELETE /api/addresses.php?id={id}
 */
export const deleteAddress = async (addressId) => {
  try {
    console.log('🗑️ Deleting address:', addressId);
    const response = await axiosInstance.delete(`/api/addresses.php?id=${addressId}`);
    console.log('✅ Address deleted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error deleting address:', error);
    throw error;
  }
};

/**
 * Set address as default
 * POST /api/set-default-address.php
 */
export const setDefaultAddress = async (addressId) => {
  try {
    console.log('⭐ Setting default address:', addressId);

    const formData = new URLSearchParams();
    formData.append('address_id', addressId.toString());

    const response = await axiosInstance.post('/api/set-default-address.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Default address set successfully:', response);
    // axios interceptor returns data directly
    return { success: response?.success !== false, data: response?.data || response };
  } catch (error) {
    console.error('❌ Error setting default address:', error);
    throw error;
  }
};

export default {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
};
