import axiosInstance from './axiosConfig';

/**
 * Get Product by ID
 * GET /api/product.php?id={id}
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/product.php?id=${productId}`);
    console.log('✅ Product fetched by ID:', productId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Get Product by Slug
 * GET /api/product.php?slug={slug}
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/product.php?slug=${slug}`);
    console.log('✅ Product fetched by slug:', slug);
    return response;
  } catch (error) {
    console.error('❌ Error fetching product by slug:', error);
    throw error;
  }
};

export default getProductById;
