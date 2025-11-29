import axiosInstance from './axiosConfig';

/**
 * Add Bundle to Cart
 * POST /add-bundle-to-cart.php
 */
export const addBundleToCart = async (bundleData) => {
  try {
    console.log('📦 Adding bundle to cart:', bundleData);

    const formData = new URLSearchParams();
    formData.append('bundle_id', bundleData.bundle_id);

    // Send frontend image path if provided
    if (bundleData.image_path) {
      formData.append('image_path', bundleData.image_path);
    }

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

export default addBundleToCart;
