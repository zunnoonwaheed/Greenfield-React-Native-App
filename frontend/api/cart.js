import axiosInstance from './axiosConfig';

/**
 * Get cart contents
 */
export const getCartContents = async () => {
  try {
    const data = await axiosInstance.get('/cart-contents.php');
    return data;
  } catch (error) {
    console.error('Error fetching cart contents:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add item to cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string|null} imagePath - Frontend image path (e.g., 'grocery-bun.png')
 */
export const addToCart = async (productId, quantity = 1, imagePath = '') => {
  try {
    const formData = new URLSearchParams();
    formData.append('product_id', productId.toString());
    formData.append('quantity', quantity.toString());

    // Send frontend image path if provided
    if (imagePath) {
      formData.append('image_path', imagePath);
    }

    const data = await axiosInstance.post('/add-to-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update cart item quantity
 */
export const updateCart = async (cartItemId, quantity) => {
  try {
    const formData = new URLSearchParams();
    formData.append('product_id', cartItemId.toString());
    formData.append('quantity', quantity.toString());

    const data = await axiosInstance.post('/update-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  } catch (error) {
    console.error('Error updating cart:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('product_id', cartItemId.toString());

    const data = await axiosInstance.post('/remove-from-cart.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
};
