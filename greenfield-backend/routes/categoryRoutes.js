const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/filter', categoryController.filterProducts);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/id/:id', categoryController.getCategoryById);
router.get('/:id/subcategories', categoryController.getSubcategories);

module.exports = router;
