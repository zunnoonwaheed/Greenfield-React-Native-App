import axiosInstance from './axiosConfig';

/**
 * Validate Delivery Location
 * POST /api/validate-delivery.php
 * Check if delivery is available to a specific phase/sector
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

export default validateDeliveryLocation;
