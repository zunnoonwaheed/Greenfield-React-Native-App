// ============================================
// CHECKOUT API MODULE
// Handles checkout-related API calls for PHP backend
// ============================================

import axiosInstance from './axiosConfig';

/**
 * GET CHECKOUT PAGE DATA - Load checkout page with cart summary
 * GET /checkout.php
 * @returns {Promise} Checkout page data with cart and billing form
 */
export const getCheckoutData = async () => {
  try {
    const response = await axiosInstance.get('/checkout.php');
    console.log('✅ Checkout data fetched');
    return response;
  } catch (error) {
    console.error('❌ Error fetching checkout data:', error);
    throw error;
  }
};

/**
 * SUBMIT ORDER - Process checkout and create order
 * POST /submit-order.php
 * @param {Object} orderData - Complete order data
 * @returns {Promise} Response with order ID and confirmation
 */
export const submitOrder = async (orderData) => {
  try {
    const formData = new URLSearchParams();

    // Customer Information
    formData.append('name', orderData.name);
    formData.append('email', orderData.email);
    formData.append('phone', orderData.phone);

    // Delivery Address
    formData.append('city', orderData.city || 'Islamabad');
    formData.append('phase', orderData.phase);
    formData.append('sector', orderData.sector);
    formData.append('street', orderData.street);
    formData.append('type', orderData.type || 'House');

    if (orderData.type === 'House') {
      formData.append('house_number', orderData.house_number || '');
    } else {
      formData.append('apartment_info', orderData.apartment_info || '');
    }

    // Additional Information
    if (orderData.delivery_notes) {
      formData.append('delivery_notes', orderData.delivery_notes);
    }

    // Payment Method
    formData.append('payment_method', orderData.payment_method || 'Cash on Delivery');

    // Guest vs Registered User
    if (orderData.is_guest) {
      formData.append('is_guest', '1');
    }

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

/**
 * CALCULATE DELIVERY CHARGE - Get delivery charge for location
 * Note: May need to implement or extract from checkout page
 * @param {Object} locationData - { city, phase, sector }
 * @returns {Promise} Delivery charge amount
 */
export const calculateDeliveryCharge = async (locationData) => {
  try {
    // This might be calculated on checkout page or via AJAX
    // Placeholder implementation
    console.warn('⚠️ Delivery charge calculation - check backend implementation');
    return {
      charge: 0,
      message: 'Free delivery',
    };
  } catch (error) {
    console.error('❌ Error calculating delivery charge:', error);
    return { charge: 0 };
  }
};

/**
 * APPLY COUPON CODE - Apply discount coupon (if implemented)
 * Note: Check if backend has coupon system
 * @param {string} couponCode - Coupon code
 * @returns {Promise} Discount information
 */
export const applyCoupon = async (couponCode) => {
  console.warn('⚠️ Coupon system not verified in PHP backend');
  return {
    success: false,
    message: 'Coupon system not implemented',
    discount: 0,
  };
};

/**
 * INLINE LOGIN FROM CHECKOUT - Login directly from checkout page
 * POST /login.php (or /checkout.php with login params)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Login response
 */
export const checkoutLogin = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('login', 'true');

    const response = await axiosInstance.post('/user-login.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Checkout login successful');
    return response;
  } catch (error) {
    console.error('❌ Checkout login error:', error);
    throw error;
  }
};
