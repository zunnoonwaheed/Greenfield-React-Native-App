import axiosInstance from './axiosConfig';

export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category_id) params.append('category_id', filters.category_id);
  if (filters.brand_id) params.append('brand_id', filters.brand_id);
  if (filters.search) params.append('search', filters.search);
  if (filters.min_price) params.append('min_price', filters.min_price);
  if (filters.max_price) params.append('max_price', filters.max_price);
  if (filters.limit) params.append('limit', filters.limit);

  return await axiosInstance.get(`/products?${params.toString()}`);
};

export const getProductBySlug = async (slug) => {
  return await axiosInstance.get(`/products/${slug}`);
};

export const getProductById = async (id) => {
  return await axiosInstance.get(`/products/id/${id}`);
};

export const searchProducts = async (query) => {
  return await axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`);
};

export const getProductsByCategory = async (categoryId) => {
  return await axiosInstance.get(`/products/category/${categoryId}`);
};

export const getFeaturedProducts = async (limit = 10) => {
  return await axiosInstance.get(`/products/featured?limit=${limit}`);
};

export const getBundleProducts = async () => {
  return await axiosInstance.get('/products/bundles');
};
