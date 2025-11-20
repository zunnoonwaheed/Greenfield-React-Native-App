import axiosInstance from './axiosConfig';

/**
 * Get All Products
 * GET /api/products.php
 */
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.brand_id) queryParams.append('brand_id', params.brand_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const url = `/api/products.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await axiosInstance.get(url);

    console.log('✅ Products fetched:', response.data?.products?.length || 0);
    return response;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

export default getProducts;
