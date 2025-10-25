const orderModel = require('../models/orderModel');

const orderController = {
  async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { location_id, items, payment_method, notes, subtotal, delivery_charges, discount_amount } = req.body;

      if (!location_id || !items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Location and items are required'
        });
      }

      const total_amount = (subtotal || 0) + (delivery_charges || 0) - (discount_amount || 0);

      const orderData = {
        user_id: userId,
        location_id,
        items,
        subtotal,
        delivery_charges,
        discount_amount,
        total_amount,
        payment_method,
        notes
      };

      const orderId = await orderModel.createOrder(orderData);

      const order = await orderModel.getOrderById(orderId, userId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: error.message
      });
    }
  },

  async getOrderById(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const order = await orderModel.getOrderById(req.params.id, userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const items = await orderModel.getOrderItems(req.params.id);

      res.json({
        success: true,
        data: {
          ...order,
          items
        }
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  },

  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const limit = req.query.limit || 50;

      const orders = await orderModel.getUserOrders(userId, limit);

      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  },

  async trackOrder(req, res) {
    try {
      const userId = req.user.id;
      const order = await orderModel.getOrderById(req.params.id, userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: {
          order_id: order.id,
          status: order.order_status,
          payment_status: order.payment_status,
          created_at: order.created_at,
          updated_at: order.updated_at
        }
      });
    } catch (error) {
      console.error('Error tracking order:', error);
      res.status(500).json({
        success: false,
        message: 'Error tracking order',
        error: error.message
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      await orderModel.updateOrderStatus(req.params.id, status);

      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message
      });
    }
  }
};

module.exports = orderController;
