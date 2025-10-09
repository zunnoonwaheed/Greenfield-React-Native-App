// ============================================
// USER CONTROLLER
// Handles user profile operations
// ============================================

const { query } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * GET PROFILE - Get current user profile
 * GET /api/user/profile
 * Headers: Authorization: Bearer TOKEN
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const userId = req.user.id;

    const result = await query(
      `SELECT id, name, email, phone, created_at, email_verified 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Get user's default location
    const locationResult = await query(
      'SELECT * FROM user_locations WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    );

    res.json({
      success: true,
      data: {
        user,
        location: locationResult.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * UPDATE PROFILE - Update user profile
 * PUT /api/user/profile
 * Body: { name, phone }
 * Headers: Authorization: Bearer TOKEN
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId); // Add userId as last parameter

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, phone`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * CHANGE PASSWORD - Update user password
 * POST /api/user/change-password
 * Body: { currentPassword, newPassword }
 * Headers: Authorization: Bearer TOKEN
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get user's current password
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * DELETE ACCOUNT - Soft delete user account
 * DELETE /api/user/account
 * Headers: Authorization: Bearer TOKEN
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Soft delete by setting is_active to false
    await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};