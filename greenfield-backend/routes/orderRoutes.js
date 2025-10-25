const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, orderController.createOrder);
router.get('/my-orders', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.get('/:id/track', authenticateToken, orderController.trackOrder);
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;
