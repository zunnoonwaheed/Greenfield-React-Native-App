/**
 * Ad Controller
 * Handles marketplace ad creation, retrieval, and management
 */

const { query } = require('../config/database');

/**
 * GET /api/ads/categories
 * Get all categories for marketplace ads
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await query('SELECT id, name, icon FROM categories ORDER BY name');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

/**
 * GET /api/ads/categories/:categoryId/subcategories
 * Get subcategories for a specific category
 */
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subcategories = await query(
      'SELECT id, name FROM subcategories WHERE category_id = ? ORDER BY name',
      [categoryId]
    );

    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories'
    });
  }
};

/**
 * POST /api/ads
 * Create a new marketplace ad
 */
exports.createAd = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      subcategory_id,
      condition,
      price,
      negotiable,
      specifications, // JSON array of tags
      city,
      address,
      phone,
      email,
      images // Array of image URLs (in production, you'd upload to S3/Cloudinary first)
    } = req.body;

    const userId = req.user.id; // From auth middleware

    // Validation
    if (!title || !description || !category_id || !condition || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Insert ad
    const result = await query(
      `INSERT INTO ads
        (user_id, title, description, category_id, subcategory_id, \`condition\`,
         price, negotiable, specifications, city, address, phone, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        description,
        category_id,
        subcategory_id || null,
        condition,
        price,
        negotiable || false,
        JSON.stringify(specifications || []),
        city,
        address,
        phone,
        email
      ]
    );

    const adId = result.insertId;

    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await query(
          'INSERT INTO ad_images (ad_id, image_url, is_primary) VALUES (?, ?, ?)',
          [adId, images[i], i === 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: {
        id: adId
      }
    });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ad'
    });
  }
};

/**
 * GET /api/ads
 * Get all active ads (with pagination)
 */
exports.getAds = async (req, res) => {
  try {
    const { page = 1, limit = 20, category_id, search } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT
        ads.id,
        ads.title,
        ads.description,
        ads.price,
        ads.negotiable,
        ads.\`condition\`,
        ads.city,
        ads.created_at,
        categories.name as category_name,
        (SELECT image_url FROM ad_images WHERE ad_id = ads.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM ads
      LEFT JOIN categories ON ads.category_id = categories.id
      WHERE ads.status = 'active'
    `;

    const params = [];

    if (category_id) {
      sql += ' AND ads.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      sql += ' AND (ads.title LIKE ? OR ads.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY ads.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const ads = await query(sql, params);

    res.json({
      success: true,
      data: ads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ads'
    });
  }
};

/**
 * GET /api/ads/:id
 * Get a single ad by ID
 */
exports.getAdById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get ad details
    const ads = await query(
      `SELECT
        ads.*,
        categories.name as category_name,
        subcategories.name as subcategory_name,
        users.name as seller_name,
        users.email as seller_email,
        users.phone as seller_phone
       FROM ads
       LEFT JOIN categories ON ads.category_id = categories.id
       LEFT JOIN subcategories ON ads.subcategory_id = subcategories.id
       LEFT JOIN users ON ads.user_id = users.id
       WHERE ads.id = ?`,
      [id]
    );

    if (ads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    const ad = ads[0];

    // Get images
    const images = await query(
      'SELECT id, image_url, is_primary FROM ad_images WHERE ad_id = ? ORDER BY is_primary DESC',
      [id]
    );

    // Parse specifications if stored as JSON string
    if (ad.specifications) {
      try {
        ad.specifications = JSON.parse(ad.specifications);
      } catch (e) {
        ad.specifications = [];
      }
    }

    // Increment views
    await query('UPDATE ads SET views = views + 1 WHERE id = ?', [id]);

    res.json({
      success: true,
      data: {
        ...ad,
        images
      }
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ad'
    });
  }
};

/**
 * GET /api/ads/my-ads
 * Get current user's ads
 */
exports.getMyAds = async (req, res) => {
  try {
    const userId = req.user.id;

    const ads = await query(
      `SELECT
        ads.id,
        ads.title,
        ads.price,
        ads.status,
        ads.views,
        ads.created_at,
        (SELECT image_url FROM ad_images WHERE ad_id = ads.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM ads
       WHERE ads.user_id = ?
       ORDER BY ads.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: ads
    });
  } catch (error) {
    console.error('Error fetching user ads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your ads'
    });
  }
};

/**
 * PUT /api/ads/:id
 * Update an ad (only by owner)
 */
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, price, negotiable, status } = req.body;

    // Check ownership
    const ads = await query('SELECT user_id FROM ads WHERE id = ?', [id]);

    if (ads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ads[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this ad'
      });
    }

    // Update ad
    await query(
      `UPDATE ads
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           negotiable = COALESCE(?, negotiable),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title, description, price, negotiable, status, id]
    );

    res.json({
      success: true,
      message: 'Ad updated successfully'
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ad'
    });
  }
};

/**
 * DELETE /api/ads/:id
 * Delete an ad (only by owner)
 */
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const ads = await query('SELECT user_id FROM ads WHERE id = ?', [id]);

    if (ads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ads[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this ad'
      });
    }

    // Delete ad (cascade will delete images)
    await query('DELETE FROM ads WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete ad'
    });
  }
};
