// ============================================
// LOCATION API - PHP BACKEND
// All location/address-related API calls
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET USER ADDRESS
 * GET /api/profile.php
 * @returns {Promise} User's address information from profile
 */
export const getUserAddress = async () => {
  try {
    const response = await axiosInstance.get('/api/profile.php');

    console.log('✅ User address fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching user address:', error);
    throw error;
  }
};

/**
 * UPDATE DELIVERY ADDRESS
 * POST /api/update-delivery.php
 * @param {Object} addressData - Address details
 * @returns {Promise} Response with updated address
 *
 * Usage:
 * const response = await updateDeliveryAddress({
 *   address: 'House #123, Street 5, Phase 2',
 *   phase_id: 1,
 *   sector_id: 5,
 *   phone: '03001234567'
 * });
 */
export const updateDeliveryAddress = async (addressData) => {
  try {
    console.log('📍 Updating delivery address:', addressData);

    const formData = new URLSearchParams();

    if (addressData.address) formData.append('address', addressData.address);
    if (addressData.phase_id) formData.append('phase_id', addressData.phase_id);
    if (addressData.sector_id) formData.append('sector_id', addressData.sector_id);
    if (addressData.phone) formData.append('phone', addressData.phone);
    if (addressData.house_number) formData.append('house_number', addressData.house_number);
    if (addressData.street) formData.append('street', addressData.street);
    if (addressData.apartment_info) formData.append('apartment_info', addressData.apartment_info);
    if (addressData.address_type) formData.append('address_type', addressData.address_type);

    const response = await axiosInstance.post('/api/update-delivery.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Delivery address updated successfully');
    return response;
  } catch (error) {
    console.error('❌ Error updating delivery address:', error);
    throw error;
  }
};

/**
 * GET SECTORS BY PHASE
 * GET /api/get-sectors.php?phase_id={id}
 * @param {string|number} phaseId - Phase ID
 * @returns {Promise} List of sectors in the phase
 */
export const getSectorsByPhase = async (phaseId) => {
  try {
    const response = await axiosInstance.get(`/get_sectors.php?phase_id=${phaseId}`);
    console.log('✅ Sectors fetched for phase:', phaseId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching sectors:', error);
    throw error;
  }
};

/**
 * GET ALL PHASES
 * GET /api/locations.php or similar endpoint for phases
 * Note: This might need to be adjusted based on actual backend implementation
 * @returns {Promise} List of available DHA phases
 */
export const getPhases = async () => {
  try {
    // If backend has a dedicated endpoint for phases, use that
    // Otherwise, we might need to get this from a different source
    const response = await axiosInstance.get('/api/locations.php');
    console.log('✅ Phases fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching phases:', error);
    throw error;
  }
};

/**
 * VALIDATE DELIVERY LOCATION
 * Check if delivery is available to a specific phase/sector
 * @param {Object} locationData - { phase_id, sector_id }
 * @returns {Promise} Delivery availability info with delivery charges
 */
export const validateDeliveryLocation = async (locationData) => {
  try {
    console.log('📍 Validating delivery to:', locationData);

    const formData = new URLSearchParams();
    if (locationData.phase_id) formData.append('phase_id', locationData.phase_id);
    if (locationData.sector_id) formData.append('sector_id', locationData.sector_id);

    const response = await axiosInstance.post('/api/validate-delivery.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Delivery location validated');
    return response;
  } catch (error) {
    console.error('❌ Error validating location:', error);
    return {
      success: false,
      available: false,
      message: 'Unable to verify delivery availability'
    };
  }
};

/**
 * FORMAT ADDRESS
 * Helper to format address from components
 * @param {Object} addressComponents - Address parts
 * @returns {string} Formatted address string
 *
 * Usage:
 * const formatted = formatAddress({
 *   address_type: 'House',
 *   house_number: '123',
 *   street: '5',
 *   sector: 'A',
 *   phase: 'Phase 2',
 *   city: 'Islamabad'
 * });
 */
export const formatAddress = (addressComponents) => {
  const parts = [];

  if (addressComponents.address_type === 'House' && addressComponents.house_number) {
    parts.push(`House #${addressComponents.house_number}`);
  } else if (addressComponents.address_type === 'Apartment' && addressComponents.apartment_info) {
    parts.push(addressComponents.apartment_info);
  }

  if (addressComponents.street) parts.push(`Street ${addressComponents.street}`);
  if (addressComponents.sector) parts.push(`Sector ${addressComponents.sector}`);
  if (addressComponents.phase) parts.push(addressComponents.phase);
  if (addressComponents.city) parts.push(addressComponents.city);

  return parts.join(', ');
};

/**
 * PARSE ADDRESS
 * Helper to parse formatted address back to components
 * @param {string} addressString - Formatted address string
 * @returns {Object} Address components
 */
export const parseAddress = (addressString) => {
  const components = {
    address: addressString,
    city: '',
    phase: '',
    sector: '',
    street: '',
    address_type: 'House',
    house_number: '',
    apartment_info: ''
  };

  // Extract city
  if (addressString.includes('Islamabad')) {
    components.city = 'Islamabad';
  } else if (addressString.includes('Rawalpindi')) {
    components.city = 'Rawalpindi';
  }

  // Extract phase
  const phaseMatch = addressString.match(/Phase\s+(\d+)/i);
  if (phaseMatch) {
    components.phase = phaseMatch[0];
  }

  // Extract sector
  const sectorMatch = addressString.match(/Sector\s+([A-Z0-9]+)/i);
  if (sectorMatch) {
    components.sector = sectorMatch[1];
  }

  // Extract house number
  const houseMatch = addressString.match(/House\s+#?(\d+)/i);
  if (houseMatch) {
    components.house_number = houseMatch[1];
    components.address_type = 'House';
  } else if (addressString.toLowerCase().includes('apartment')) {
    components.address_type = 'Apartment';
  }

  // Extract street
  const streetMatch = addressString.match(/Street\s+(\d+)/i);
  if (streetMatch) {
    components.street = streetMatch[1];
  }

  return components;
};

/**
 * SAVE NEW ADDRESS
 * Wrapper for updateDeliveryAddress to save a new address
 * @param {Object} addressData - Complete address data
 * @returns {Promise} Response with saved address
 */
export const saveNewAddress = async (addressData) => {
  return updateDeliveryAddress(addressData);
};

/**
 * GET SAVED ADDRESSES
 * Get user's saved delivery addresses
 * Note: Current PHP backend may only support one address per user
 * @returns {Promise} List of saved addresses
 */
export const getSavedAddresses = async () => {
  try {
    const response = await getUserAddress();

    // If backend returns single address in profile, format as array
    if (response.success && response.data && response.data.user) {
      const user = response.data.user;

      if (user.address || user.phase_id) {
        const address = {
          id: 1,
          address: user.address || '',
          phase_id: user.phase_id || null,
          sector_id: user.sector_id || null,
          phone: user.phone || '',
          is_default: true
        };

        return {
          success: true,
          data: { addresses: [address] }
        };
      }
    }

    return {
      success: true,
      data: { addresses: [] }
    };
  } catch (error) {
    console.error('❌ Error fetching saved addresses:', error);
    throw error;
  }
};

// ============================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================

/**
 * Alias for updateDeliveryAddress
 */
export const updateUserAddress = updateDeliveryAddress;

/**
 * Alias for getUserAddress
 */
export const getDefaultLocation = getUserAddress;

/**
 * Alias for getSavedAddresses
 */
export const getLocations = getSavedAddresses;

/**
 * Alias for saveNewAddress
 */
export const addLocation = saveNewAddress;

export default {
  getUserAddress,
  updateDeliveryAddress,
  getSectorsByPhase,
  getPhases,
  validateDeliveryLocation,
  formatAddress,
  parseAddress,
  saveNewAddress,
  getSavedAddresses,
  // Aliases
  updateUserAddress,
  getDefaultLocation,
  getLocations,
  addLocation,
};
