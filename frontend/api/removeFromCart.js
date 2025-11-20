import axiosInstance from './axiosConfig';

/**
 * Remove from Cart
 * POST /remove-from-cart.php
 */
export const removeFromCart = async (productId) => {
  try {
    console.log('🗑️ Removing from cart:', productId);

    const formData = new URLSearchParams();
    formData.append('product_id', productId);

    const response = await axiosInstance.post('/remove-from-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Removed from cart successfully');
    return response;
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    throw error;
  }
};

export default removeFromCart;
