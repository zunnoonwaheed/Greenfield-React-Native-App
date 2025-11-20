// ============================================
// PHP RESPONSE PARSER UTILITY
// Helper functions to parse PHP backend responses
// PHP backend may return HTML or mixed responses
// ============================================

/**
 * Check if response is HTML
 * @param {any} response - API response
 * @returns {boolean} True if response contains HTML
 */
export const isHTMLResponse = (response) => {
  if (typeof response === 'string') {
    return response.trim().startsWith('<') || response.includes('<!DOCTYPE');
  }
  return false;
};

/**
 * Check if response is JSON
 * @param {any} response - API response
 * @returns {boolean} True if response is JSON object
 */
export const isJSONResponse = (response) => {
  return typeof response === 'object' && response !== null && !Array.isArray(response);
};

/**
 * Parse success message from HTML response
 * @param {string} html - HTML string
 * @returns {Object} Parsed success info
 */
export const parseHTMLSuccess = (html) => {
  const result = {
    success: false,
    message: '',
  };

  if (typeof html !== 'string') return result;

  // Common success patterns in PHP responses
  const successPatterns = [
    /Registration successful/i,
    /Login successful/i,
    /successfully/i,
    /success/i,
    /Added to cart/i,
    /Order placed/i,
    /Updated successfully/i,
  ];

  for (const pattern of successPatterns) {
    if (pattern.test(html)) {
      result.success = true;
      result.message = html.match(pattern)?.[0] || 'Operation successful';
      break;
    }
  }

  return result;
};

/**
 * Parse error message from HTML response
 * @param {string} html - HTML string
 * @returns {Object} Parsed error info
 */
export const parseHTMLError = (html) => {
  const result = {
    error: false,
    message: '',
  };

  if (typeof html !== 'string') return result;

  // Common error patterns in PHP responses
  const errorPatterns = [
    /Invalid password/i,
    /User not found/i,
    /Email already registered/i,
    /All fields are required/i,
    /Something went wrong/i,
    /Error:/i,
    /Failed/i,
  ];

  for (const pattern of errorPatterns) {
    if (pattern.test(html)) {
      result.error = true;
      result.message = html.match(pattern)?.[0] || 'Operation failed';
      break;
    }
  }

  return result;
};

/**
 * Extract data from HTML tables (for orders, products, etc.)
 * @param {string} html - HTML string
 * @returns {Array} Extracted table data
 */
export const extractTableData = (html) => {
  const rows = [];

  if (typeof html !== 'string') return rows;

  // Basic table parsing - can be enhanced with a proper HTML parser if needed
  const tableRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
  const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gis;

  const tableMatches = html.matchAll(tableRegex);

  for (const tableMatch of tableMatches) {
    const rowHtml = tableMatch[1];
    const cells = [];
    const cellMatches = rowHtml.matchAll(cellRegex);

    for (const cellMatch of cellMatches) {
      // Strip HTML tags from cell content
      const cellText = cellMatch[1].replace(/<[^>]+>/g, '').trim();
      cells.push(cellText);
    }

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
};

/**
 * Parse cart data from HTML response
 * @param {string} html - HTML string from cart-contents.php
 * @returns {Object} Cart data { items, total, count }
 */
export const parseCartHTML = (html) => {
  const cart = {
    items: [],
    total: 0,
    count: 0,
  };

  if (typeof html !== 'string') return cart;

  // Extract cart items
  const itemRegex = /data-product-id=["'](\d+)["'][^>]*>(.*?)<\/div>/gis;
  const items = html.matchAll(itemRegex);

  for (const item of items) {
    cart.items.push({
      product_id: item[1],
      html: item[2],
    });
  }

  cart.count = cart.items.length;

  // Extract total
  const totalRegex = /Total:?\s*Rs\.?\s*([\d,]+)/i;
  const totalMatch = html.match(totalRegex);
  if (totalMatch) {
    cart.total = parseFloat(totalMatch[1].replace(/,/g, ''));
  }

  return cart;
};

/**
 * Parse product list from HTML
 * @param {string} html - HTML string
 * @returns {Array} Product array
 */
export const parseProductsHTML = (html) => {
  const products = [];

  if (typeof html !== 'string') return products;

  // This is a placeholder - actual parsing depends on your HTML structure
  // You may need to adjust the regex patterns based on your PHP output

  return products;
};

/**
 * Parse user data from dashboard/profile HTML
 * @param {string} html - HTML string
 * @returns {Object} User data
 */
export const parseUserDataHTML = (html) => {
  const user = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  if (typeof html !== 'string') return user;

  // Extract user info from HTML
  // These patterns should match your PHP output structure
  const patterns = {
    name: /Name:?\s*<[^>]+>([^<]+)</i,
    email: /Email:?\s*<[^>]+>([^<]+)</i,
    phone: /Phone:?\s*<[^>]+>([^<]+)</i,
    address: /Address:?\s*<[^>]+>([^<]+)</i,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = html.match(pattern);
    if (match) {
      user[key] = match[1].trim();
    }
  }

  return user;
};

/**
 * Smart response parser - automatically detects and parses response type
 * @param {any} response - API response
 * @returns {Object} Parsed response with metadata
 */
export const parseResponse = (response) => {
  const result = {
    type: 'unknown',
    data: null,
    success: false,
    message: '',
    raw: response,
  };

  // If already JSON object, return as-is
  if (isJSONResponse(response)) {
    result.type = 'json';
    result.data = response;
    result.success = response.success !== false;
    result.message = response.message || '';
    return result;
  }

  // If HTML, parse it
  if (isHTMLResponse(response)) {
    result.type = 'html';

    // Check for success messages
    const successInfo = parseHTMLSuccess(response);
    if (successInfo.success) {
      result.success = true;
      result.message = successInfo.message;
    }

    // Check for error messages
    const errorInfo = parseHTMLError(response);
    if (errorInfo.error) {
      result.success = false;
      result.message = errorInfo.message;
    }

    // Try to extract structured data
    const tableData = extractTableData(response);
    if (tableData.length > 0) {
      result.data = tableData;
    }
  }

  // If plain text
  if (typeof response === 'string' && !isHTMLResponse(response)) {
    result.type = 'text';
    result.data = response;
    result.message = response;
  }

  return result;
};

/**
 * Extract redirect URL from HTML response
 * @param {string} html - HTML string
 * @returns {string|null} Redirect URL if found
 */
export const extractRedirectURL = (html) => {
  if (typeof html !== 'string') return null;

  // Check for meta refresh
  const metaRefresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^;"]+;\s*url=([^"']+)/i);
  if (metaRefresh) return metaRefresh[1];

  // Check for JavaScript redirect
  const jsRedirect = html.match(/window\.location\s*=\s*["']([^"']+)/i);
  if (jsRedirect) return jsRedirect[1];

  const jsRedirect2 = html.match(/window\.location\.href\s*=\s*["']([^"']+)/i);
  if (jsRedirect2) return jsRedirect2[1];

  return null;
};

/**
 * Check if response indicates authentication required
 * @param {any} response - API response
 * @returns {boolean} True if auth required
 */
export const requiresAuthentication = (response) => {
  if (typeof response === 'string') {
    return (
      response.includes('login') ||
      response.includes('unauthorized') ||
      response.includes('Please log in') ||
      response.includes('authentication required')
    );
  }

  if (isJSONResponse(response)) {
    return response.authenticated === false || response.requiresAuth === true;
  }

  return false;
};

/**
 * Normalize API response to consistent format
 * Always returns { success, data, message, error }
 * @param {any} response - Any API response
 * @returns {Object} Normalized response
 */
export const normalizeResponse = (response) => {
  const normalized = {
    success: false,
    data: null,
    message: '',
    error: null,
  };

  // Parse the response
  const parsed = parseResponse(response);

  normalized.success = parsed.success;
  normalized.data = parsed.data;
  normalized.message = parsed.message;

  if (!parsed.success) {
    normalized.error = parsed.message || 'Operation failed';
  }

  return normalized;
};

export default {
  isHTMLResponse,
  isJSONResponse,
  parseHTMLSuccess,
  parseHTMLError,
  extractTableData,
  parseCartHTML,
  parseProductsHTML,
  parseUserDataHTML,
  parseResponse,
  extractRedirectURL,
  requiresAuthentication,
  normalizeResponse,
};
