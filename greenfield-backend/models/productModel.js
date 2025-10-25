const { query } = require('../config/database');

const productModel = {
  async getAllProducts(filters = {}) {
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.status = 'active'
    `;

    const params = [];

    if (filters.category_id) {
      sql += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.brand_id) {
      sql += ' AND p.brand_id = ?';
      params.push(filters.brand_id);
    }

    if (filters.search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.min_price) {
      sql += ' AND p.price >= ?';
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      sql += ' AND p.price <= ?';
      params.push(filters.max_price);
    }

    sql += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await query(sql, params);
  },

  async getProductById(id) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             b.name as brand_name, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ? AND p.status = 'active'
    `;
    const results = await query(sql, [id]);
    return results[0];
  },

  async getProductBySlug(slug) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             b.name as brand_name, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.slug = ? AND p.status = 'active'
    `;
    const results = await query(sql, [slug]);
    return results[0];
  },

  async searchProducts(searchTerm) {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)
        AND p.status = 'active'
      ORDER BY p.name ASC
      LIMIT 50
    `;
    const searchPattern = `%${searchTerm}%`;
    return await query(sql, [searchPattern, searchPattern, searchPattern]);
  },

  async getProductsByCategory(categoryId) {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.category_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC
    `;
    return await query(sql, [categoryId]);
  },

  async getFeaturedProducts(limit = 10) {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_featured = 1 AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    return await query(sql, [limit]);
  },

  async getBundleProducts() {
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_bundle = 1 AND p.status = 'active'
      ORDER BY p.created_at DESC
    `;
    return await query(sql);
  }
};

module.exports = productModel;
