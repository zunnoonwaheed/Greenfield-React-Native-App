const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bundles', productController.getBundleProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:slug', productController.getProductBySlug);
router.get('/id/:id', productController.getProductById);

module.exports = router;
