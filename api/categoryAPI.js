import axiosInstance from './axiosConfig';

export const getCategories = async () => {
  return await axiosInstance.get('/categories');
};

export const getCategoryById = async (id) => {
  return await axiosInstance.get(`/categories/id/${id}`);
};

export const getCategoryBySlug = async (slug) => {
  return await axiosInstance.get(`/categories/${slug}`);
};

export const getSubcategories = async (parentId) => {
  return await axiosInstance.get(`/categories/${parentId}/subcategories`);
};

export const filterProducts = async (filters) => {
  return await axiosInstance.post('/categories/filter', filters);
};
