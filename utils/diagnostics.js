/**
 * DIAGNOSTIC UTILITIES
 * Helper functions to catch undefined/null errors early in development
 */

/**
 * Safe object spread - prevents spreading undefined/null
 * @param {*} obj - Object to spread
 * @param {Object} fallback - Fallback object if obj is undefined/null
 * @returns {Object} Safe object
 *
 * Usage:
 * const settings = safeSpread(config, {}); // Returns {} if config is undefined
 */
export const safeSpread = (obj, fallback = {}) => {
  if (obj === undefined || obj === null) {
    console.warn('⚠️ Attempted to spread undefined/null object, using fallback:', fallback);
    return fallback;
  }
  return obj;
};

/**
 * Safe object keys - prevents Object.keys on undefined/null
 * @param {*} obj - Object to get keys from
 * @returns {Array} Array of keys
 *
 * Usage:
 * const keys = safeKeys(someObject); // Returns [] if someObject is undefined
 */
export const safeKeys = (obj) => {
  if (obj === undefined || obj === null) {
    console.warn('⚠️ Attempted to get keys of undefined/null object');
    return [];
  }
  return Object.keys(obj || {});
};

/**
 * Safe property access - prevents accessing properties on undefined/null
 * @param {*} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} fallback - Fallback value
 * @returns {*} Property value or fallback
 *
 * Usage:
 * const name = safeGet(user, 'profile.name', 'Unknown');
 */
export const safeGet = (obj, path, fallback = undefined) => {
  if (obj === undefined || obj === null) {
    console.warn(`⚠️ Attempted to access property '${path}' on undefined/null object`);
    return fallback;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return fallback;
    }
    result = result[key];
  }

  return result === undefined ? fallback : result;
};

/**
 * Validate required object properties
 * @param {Object} obj - Object to validate
 * @param {Array<string>} requiredProps - Required property names
 * @param {string} objectName - Name for error messages
 * @throws {Error} If any required property is missing
 *
 * Usage:
 * validateRequired(userData, ['email', 'password'], 'User data');
 */
export const validateRequired = (obj, requiredProps, objectName = 'Object') => {
  if (!obj || typeof obj !== 'object') {
    throw new Error(`${objectName} is undefined or not an object`);
  }

  const missing = requiredProps.filter(prop => obj[prop] === undefined);

  if (missing.length > 0) {
    throw new Error(`${objectName} is missing required properties: ${missing.join(', ')}`);
  }
};

/**
 * Safe JSON parse - prevents errors from invalid JSON
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 *
 * Usage:
 * const data = safeJsonParse(response, {});
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  if (!jsonString || typeof jsonString !== 'string') {
    console.warn('⚠️ Attempted to parse invalid JSON string');
    return fallback;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return fallback;
  }
};

/**
 * Deep freeze an object to prevent mutations (useful for constants)
 * @param {Object} obj - Object to freeze
 * @returns {Object} Frozen object
 *
 * Usage:
 * const config = deepFreeze({ api: { url: '...' } });
 */
export const deepFreeze = (obj) => {
  if (obj === undefined || obj === null || typeof obj !== 'object') {
    return obj;
  }

  Object.keys(obj || {}).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });

  return Object.freeze(obj);
};

/**
 * Check if value is defined (not undefined or null)
 * @param {*} value - Value to check
 * @returns {boolean} True if defined
 *
 * Usage:
 * if (isDefined(user)) { ... }
 */
export const isDefined = (value) => {
  return value !== undefined && value !== null;
};

/**
 * Assert value is defined - throws error if not
 * @param {*} value - Value to check
 * @param {string} message - Error message
 * @throws {Error} If value is undefined/null
 *
 * Usage:
 * assertDefined(config.apiKey, 'API key is required');
 */
export const assertDefined = (value, message = 'Value is undefined or null') => {
  if (!isDefined(value)) {
    throw new Error(`❌ Assertion failed: ${message}`);
  }
};

/**
 * Log import validation - use at the top of files to verify imports
 * @param {Object} imports - Object of imports to validate
 * @param {string} fileName - File name for error messages
 *
 * Usage:
 * import * as API from './api';
 * validateImports({ API }, 'MyComponent.tsx');
 */
export const validateImports = (imports, fileName = 'Unknown file') => {
  Object.entries(imports || {}).forEach(([name, value]) => {
    if (value === undefined) {
      console.error(`❌ Import validation failed in ${fileName}: '${name}' is undefined`);
      throw new Error(`Import '${name}' is undefined in ${fileName}`);
    }
  });
};

// Export all utilities
export default {
  safeSpread,
  safeKeys,
  safeGet,
  validateRequired,
  safeJsonParse,
  deepFreeze,
  isDefined,
  assertDefined,
  validateImports,
};
