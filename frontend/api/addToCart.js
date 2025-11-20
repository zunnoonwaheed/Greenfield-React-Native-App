import axiosInstance from './axiosConfig';

/**
 * Add to Cart
 * POST /add-to-cart.php
 */
export const addToCart = async (cartData) => {
  try {
    console.log('📦 Adding to cart:', cartData);

    const formData = new URLSearchParams();
    formData.append('product_id', cartData.product_id);
    formData.append('quantity', cartData.quantity || 1);
    if (cartData.price) formData.append('price', cartData.price);

    const response = await axiosInstance.post('/add-to-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Added to cart successfully');
    return response;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    throw error;
  }
};

export default addToCart;
