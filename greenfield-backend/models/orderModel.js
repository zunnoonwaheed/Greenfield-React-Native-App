const { query, getConnection } = require('../config/database');

const orderModel = {
  async createOrder(orderData) {
    const connection = await getConnection();

    try {
      await connection.beginTransaction();

      const orderSql = `
        INSERT INTO orders (
          user_id, location_id, total_amount, subtotal,
          delivery_charges, discount_amount, payment_method,
          payment_status, order_status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const orderResult = await connection.query(orderSql, [
        orderData.user_id,
        orderData.location_id,
        orderData.total_amount,
        orderData.subtotal,
        orderData.delivery_charges || 0,
        orderData.discount_amount || 0,
        orderData.payment_method || 'cod',
        'pending',
        'pending',
        orderData.notes || null
      ]);

      const orderId = orderResult[0].insertId;

      if (orderData.items && orderData.items.length > 0) {
        const itemSql = `
          INSERT INTO order_items (
            order_id, product_id, quantity, price, total
          ) VALUES ?
        `;

        const itemValues = orderData.items.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.quantity * item.price
        ]);

        await connection.query(itemSql, [itemValues]);
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getOrderById(orderId, userId = null) {
    let sql = `
      SELECT o.*, u.name as user_name, u.email as user_email,
             ul.address, ul.city, ul.area
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN user_locations ul ON o.location_id = ul.id
      WHERE o.id = ?
    `;

    const params = [orderId];

    if (userId) {
      sql += ' AND o.user_id = ?';
      params.push(userId);
    }

    const results = await query(sql, params);
    return results[0];
  },

  async getOrderItems(orderId) {
    const sql = `
      SELECT oi.*, p.name as product_name, p.image, p.sku
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
    `;
    return await query(sql, [orderId]);
  },

  async getUserOrders(userId, limit = 50) {
    const sql = `
      SELECT o.*, ul.address, ul.city, ul.area,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN user_locations ul ON o.location_id = ul.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ?
    `;
    return await query(sql, [userId, limit]);
  },

  async updateOrderStatus(orderId, status) {
    const sql = `
      UPDATE orders
      SET order_status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    return await query(sql, [status, orderId]);
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    const sql = `
      UPDATE orders
      SET payment_status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    return await query(sql, [paymentStatus, orderId]);
  }
};

module.exports = orderModel;
