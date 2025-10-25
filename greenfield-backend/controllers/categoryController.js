const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');

const categoryController = {
  async getAllCategories(req, res) {
    try {
      const categories = await categoryModel.getAllCategories();

      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message
      });
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await categoryModel.getCategoryById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message
      });
    }
  },

  async getCategoryBySlug(req, res) {
    try {
      const category = await categoryModel.getCategoryBySlug(req.params.slug);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message
      });
    }
  },

  async getSubcategories(req, res) {
    try {
      const subcategories = await categoryModel.getSubcategories(req.params.id);

      res.json({
        success: true,
        data: subcategories,
        count: subcategories.length
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching subcategories',
        error: error.message
      });
    }
  },

  async filterProducts(req, res) {
    try {
      const { category_id, brand_id, min_price, max_price, search } = req.body;

      const filters = {
        category_id,
        brand_id,
        min_price,
        max_price,
        search
      };

      const products = await productModel.getAllProducts(filters);

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error filtering products:', error);
      res.status(500).json({
        success: false,
        message: 'Error filtering products',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;
