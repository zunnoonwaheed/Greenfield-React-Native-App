import axiosInstance from './axiosConfig';

/**
 * Submit Order
 * POST /submit-order.php
 */
export const submitOrder = async (orderData) => {
  try {
    console.log('📦 Submitting order:', orderData);

    const formData = new URLSearchParams();

    // Delivery information
    if (orderData.address) formData.append('address', orderData.address);
    if (orderData.phase_id) formData.append('phase_id', orderData.phase_id);
    if (orderData.sector_id) formData.append('sector_id', orderData.sector_id);
    if (orderData.phone) formData.append('phone', orderData.phone);
    if (orderData.house_number) formData.append('house_number', orderData.house_number);
    if (orderData.street) formData.append('street', orderData.street);
    if (orderData.apartment_info) formData.append('apartment_info', orderData.apartment_info);
    if (orderData.address_type) formData.append('address_type', orderData.address_type);

    // Payment information
    if (orderData.payment_method) formData.append('payment_method', orderData.payment_method);

    // Order notes
    if (orderData.notes) formData.append('notes', orderData.notes);

    // Delivery time preference
    if (orderData.delivery_time) formData.append('delivery_time', orderData.delivery_time);

    const response = await axiosInstance.post('/submit-order.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Order submitted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error submitting order:', error);
    throw error;
  }
};

export default submitOrder;
