import axiosInstance from './axiosConfig';

/**
 * Update Cart
 * POST /update-cart.php
 */
export const updateCart = async (updateData) => {
  try {
    console.log('🔄 Updating cart:', updateData);

    const formData = new URLSearchParams();
    formData.append('product_id', updateData.product_id);

    if (updateData.action) {
      formData.append('action', updateData.action);
    } else if (updateData.quantity !== undefined) {
      formData.append('quantity', updateData.quantity);
    }

    const response = await axiosInstance.post('/update-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Cart updated successfully');
    return response;
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    throw error;
  }
};

export default updateCart;
