const { query } = require('../config/database');

const categoryModel = {
  async getAllCategories() {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    return await query(sql);
  },

  async getCategoryById(id) {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.id = ? AND c.status = 'active'
      GROUP BY c.id
    `;
    const results = await query(sql, [id]);
    return results[0];
  },

  async getCategoryBySlug(slug) {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.slug = ? AND c.status = 'active'
      GROUP BY c.id
    `;
    const results = await query(sql, [slug]);
    return results[0];
  },

  async getSubcategories(parentId) {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.parent_id = ? AND c.status = 'active'
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    return await query(sql, [parentId]);
  }
};

module.exports = categoryModel;
