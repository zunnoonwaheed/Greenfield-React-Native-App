// ============================================
// CART API - PHP BACKEND
// All cart-related API calls
// Backend uses SESSION-based cart management
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET CART CONTENTS
 * GET /api/cart-contents.php
 * @returns {Promise} Current cart data with items, total, count
 */
export const getCartContents = async () => {
  try {
    const response = await axiosInstance.get('/cart-contents.php');
    console.log('✅ Cart contents fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching cart contents:', error);
    throw error;
  }
};

/**
 * ADD TO CART
 * POST /api/add-to-cart.php
 * @param {Object} cartData - { product_id, quantity, price }
 * @returns {Promise} Response with updated cart
 */
export const addToCart = async (cartData) => {
  try {
    console.log('📦 Adding to cart:', cartData);

    // PHP backend expects form-urlencoded data
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

/**
 * UPDATE CART
 * POST /api/update-cart.php
 * @param {Object} updateData - { product_id, action: 'increase'|'decrease'|'remove' } OR { product_id, quantity }
 * @returns {Promise} Response with updated cart
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

/**
 * REMOVE FROM CART
 * POST /api/remove-from-cart.php
 * @param {number|string} productId - Product ID to remove
 * @returns {Promise} Response with updated cart
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

/**
 * CLEAR CART
 * GET /api/clear-cart.php
 * @returns {Promise} Response confirming cart cleared
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.get('/clear-cart.php');
    console.log('✅ Cart cleared successfully');
    return response;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    throw error;
  }
};

/**
 * ADD BUNDLE TO CART
 * POST /api/add-bundle-to-cart.php
 * @param {Object} bundleData - { bundle_id }
 * @returns {Promise} Response with cart updated with bundle items
 */
export const addBundleToCart = async (bundleData) => {
  try {
    console.log('📦 Adding bundle to cart:', bundleData);

    const formData = new URLSearchParams();
    formData.append('bundle_id', bundleData.bundle_id);

    const response = await axiosInstance.post('/add-bundle-to-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Bundle added to cart successfully');
    return response;
  } catch (error) {
    console.error('❌ Error adding bundle to cart:', error);
    throw error;
  }
};

/**
 * INCREASE QUANTITY
 * Helper function to increase product quantity in cart
 * @param {number|string} productId - Product ID
 * @returns {Promise} Response with updated cart
 */
export const increaseQuantity = async (productId) => {
  return updateCart({ product_id: productId, action: 'increase' });
};

/**
 * DECREASE QUANTITY
 * Helper function to decrease product quantity in cart
 * @param {number|string} productId - Product ID
 * @returns {Promise} Response with updated cart
 */
export const decreaseQuantity = async (productId) => {
  return updateCart({ product_id: productId, action: 'decrease' });
};

/**
 * SET QUANTITY
 * Helper function to set exact quantity for product in cart
 * @param {number|string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Response with updated cart
 */
export const setQuantity = async (productId, quantity) => {
  return updateCart({ product_id: productId, quantity: quantity });
};

/**
 * GET CART COUNT
 * Helper function to get total number of items in cart
 * @returns {Promise<number>} Total item count
 */
export const getCartCount = async () => {
  try {
    const response = await getCartContents();
    if (response.success && response.data) {
      return response.data.count || 0;
    }
    return 0;
  } catch (error) {
    console.error('❌ Error getting cart count:', error);
    return 0;
  }
};

/**
 * GET CART TOTAL
 * Helper function to get cart total price
 * @returns {Promise<number>} Total price
 */
export const getCartTotal = async () => {
  try {
    const response = await getCartContents();
    if (response.success && response.data) {
      return response.data.total || 0;
    }
    return 0;
  } catch (error) {
    console.error('❌ Error getting cart total:', error);
    return 0;
  }
};

export default {
  getCartContents,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  addBundleToCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  getCartCount,
  getCartTotal,
};
