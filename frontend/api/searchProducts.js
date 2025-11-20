import axiosInstance from './axiosConfig';

/**
 * Search Products
 * POST /search-product.php
 */
export const searchProducts = async (query) => {
  try {
    const formData = new URLSearchParams();
    formData.append('q', query);

    const response = await axiosInstance.post('/search-product.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Search completed for:', query);
    return response;
  } catch (error) {
    console.error('❌ Error searching products:', error);
    throw error;
  }
};

export default searchProducts;
