// ============================================
// LOCATION CONTROLLER
// Handles user location/address management
// ============================================

const { query, getClient } = require('../config/database');

/**
 * ADD LOCATION - Add new user location
 * POST /api/location/add
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
exports.addLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, area, sector, streetNumber, propertyType, houseNumber } = req.body;

    // Validation
    if (!city || !area) {
      return res.status(400).json({
        success: false,
        message: 'City and area are required'
      });
    }

    // Build full address string
    const addressParts = [city, area, sector, `Street ${streetNumber}`];
    if (propertyType === 'house') {
      addressParts.push(`House ${houseNumber}`);
    } else if (propertyType === 'apartment') {
      addressParts.push(`Apartment ${houseNumber}`);
    }
    const fullAddress = addressParts.filter(Boolean).join(', ');

    // Check if user has any locations
    const existingLocations = await query(
      'SELECT id FROM user_locations WHERE user_id = $1',
      [userId]
    );

    // If this is the first location, make it default
    const isDefault = existingLocations.rows.length === 0;

    const result = await query(
      `INSERT INTO user_locations 
       (user_id, city, area, sector, street_number, property_type, house_number, full_address, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [userId, city, area, sector, streetNumber, propertyType, houseNumber, fullAddress, isDefault]
    );

    res.status(201).json({
      success: true,
      message: 'Location added successfully',
      data: {
        location: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Add location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * GET LOCATIONS - Get all user locations
 * GET /api/location/list
 * Headers: Authorization: Bearer TOKEN
 */
exports.getLocations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM user_locations WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: {
        locations: result.rows
      }
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * GET DEFAULT LOCATION - Get user's default location
 * GET /api/location/default
 * Headers: Authorization: Bearer TOKEN
 */
exports.getDefaultLocation = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM user_locations WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No default location found'
      });
    }

    res.json({
      success: true,
      data: {
        location: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get default location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * SET DEFAULT LOCATION - Set a location as default
 * PUT /api/location/set-default/:locationId
 * Headers: Authorization: Bearer TOKEN
 */
exports.setDefaultLocation = async (req, res) => {
  const client = await getClient();
  
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;

    await client.query('BEGIN');

    // Verify location belongs to user
    const locationCheck = await client.query(
      'SELECT id FROM user_locations WHERE id = $1 AND user_id = $2',
      [locationId, userId]
    );

    if (locationCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Remove default from all user locations
    await client.query(
      'UPDATE user_locations SET is_default = false WHERE user_id = $1',
      [userId]
    );

    // Set new default location
    const result = await client.query(
      'UPDATE user_locations SET is_default = true WHERE id = $1 RETURNING *',
      [locationId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Default location updated',
      data: {
        location: result.rows[0]
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Set default location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * UPDATE LOCATION - Update existing location
 * PUT /api/location/update/:locationId
 * Body: { city, area, sector, streetNumber, propertyType, houseNumber }
 * Headers: Authorization: Bearer TOKEN
 */
exports.updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;
    const { city, area, sector, streetNumber, propertyType, houseNumber } = req.body;

    // Verify location belongs to user
    const locationCheck = await query(
      'SELECT id FROM user_locations WHERE id = $1 AND user_id = $2',
      [locationId, userId]
    );

    if (locationCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    // Build full address string
    const addressParts = [city, area, sector, `Street ${streetNumber}`];
    if (propertyType === 'house') {
      addressParts.push(`House ${houseNumber}`);
    } else if (propertyType === 'apartment') {
      addressParts.push(`Apartment ${houseNumber}`);
    }
    const fullAddress = addressParts.filter(Boolean).join(', ');

    const result = await query(
      `UPDATE user_locations 
       SET city = $1, area = $2, sector = $3, street_number = $4, 
           property_type = $5, house_number = $6, full_address = $7, 
           updated_at = NOW()
       WHERE id = $8 AND user_id = $9 
       RETURNING *`,
      [city, area, sector, streetNumber, propertyType, houseNumber, fullAddress, locationId, userId]
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * DELETE LOCATION - Delete a location
 * DELETE /api/location/delete/:locationId
 * Headers: Authorization: Bearer TOKEN
 */
exports.deleteLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const locationId = req.params.locationId;

    // Check if location exists and belongs to user
    const locationCheck = await query(
      'SELECT is_default FROM user_locations WHERE id = $1 AND user_id = $2',
      [locationId, userId]
    );

    if (locationCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const wasDefault = locationCheck.rows[0].is_default;

    // Delete location
    await query(
      'DELETE FROM user_locations WHERE id = $1 AND user_id = $2',
      [locationId, userId]
    );

    // If deleted location was default, set another location as default
    if (wasDefault) {
      await query(
        `UPDATE user_locations 
         SET is_default = true 
         WHERE user_id = $1 
         AND id = (SELECT id FROM user_locations WHERE user_id = $1 LIMIT 1)`,
        [userId]
      );
    }

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};