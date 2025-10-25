/**
 * Ad Routes
 * Routes for marketplace ads functionality
 */

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/categories', adController.getCategories);
router.get('/categories/:categoryId/subcategories', adController.getSubcategories);
router.get('/', adController.getAds);
router.get('/:id', adController.getAdById);

// Protected routes (require authentication)
router.post('/', authenticateToken, adController.createAd);
router.get('/my/ads', authenticateToken, adController.getMyAds);
router.put('/:id', authenticateToken, adController.updateAd);
router.delete('/:id', authenticateToken, adController.deleteAd);

module.exports = router;
