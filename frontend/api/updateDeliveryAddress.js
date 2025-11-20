import axiosInstance from './axiosConfig';

/**
 * Update Delivery Address
 * POST /api/update-delivery.php
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

export default updateDeliveryAddress;
