const productModel = require('../models/productModel');

const productController = {
  async getAllProducts(req, res) {
    try {
      const filters = {
        category_id: req.query.category_id,
        brand_id: req.query.brand_id,
        search: req.query.search,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        limit: req.query.limit || 100
      };

      const products = await productModel.getAllProducts(filters);

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await productModel.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  async getProductBySlug(req, res) {
    try {
      const product = await productModel.getProductBySlug(req.params.slug);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  async searchProducts(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const products = await productModel.searchProducts(q.trim());

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching products',
        error: error.message
      });
    }
  },

  async getProductsByCategory(req, res) {
    try {
      const products = await productModel.getProductsByCategory(req.params.categoryId);

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  async getFeaturedProducts(req, res) {
    try {
      const limit = req.query.limit || 10;
      const products = await productModel.getFeaturedProducts(limit);

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching featured products',
        error: error.message
      });
    }
  },

  async getBundleProducts(req, res) {
    try {
      const products = await productModel.getBundleProducts();

      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      console.error('Error fetching bundle products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching bundle products',
        error: error.message
      });
    }
  }
};

module.exports = productController;
