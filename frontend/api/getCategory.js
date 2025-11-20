import axiosInstance from './axiosConfig';

/**
 * Get Category by ID
 * GET /api/category.php?id={id}
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/api/category.php?id=${categoryId}`);
    console.log('✅ Category fetched by ID:', categoryId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching category by ID:', error);
    throw error;
  }
};

/**
 * Get Category by Slug
 * GET /api/category.php?slug={slug}
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/api/category.php?slug=${slug}`);
    console.log('✅ Category fetched by slug:', slug);
    return response;
  } catch (error) {
    console.error('❌ Error fetching category by slug:', error);
    throw error;
  }
};

export default getCategoryById;
