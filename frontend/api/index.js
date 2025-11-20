// ============================================
// CENTRALIZED API EXPORTS
// Import all API modules from this single file
// ============================================

// Configuration and utilities
export { default as axiosInstance } from './axiosConfig';
export {
  API_BASE_URL,
  checkServerHealth,
  getNetworkDiagnostics,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserData,
  getUserData,
} from './axiosConfig';

// PHP Response Parser (for handling HTML responses from PHP backend)
export * as PHPParser from './phpResponseParser';

// ============================================
// GROUPED API MODULES (Legacy - use separate exports below)
// ============================================

// Authentication API
export * as AuthAPI from './authAPI';

// User API
export * as UserAPI from './userAPI';

// Product API
export * as ProductAPI from './productAPI';

// Category API
export * as CategoryAPI from './categoryAPI';

// Cart API
export * as CartAPI from './cartAPI';

// Bundle API
export * as BundleAPI from './bundleAPI';

// Order API
export * as OrderAPI from './orderAPI';

// Checkout API
export * as CheckoutAPI from './checkoutAPI';

// Location API
export * as LocationAPI from './locationAPI';

// Advertisement API (if exists)
export * as AdAPI from './adAPI';

// ============================================
// SEPARATE ENDPOINT EXPORTS (Recommended)
// ============================================

// Cart Endpoints
export { getCartContents } from './getCartContents';
export { addToCart } from './addToCart';
export { updateCart } from './updateCart';
export { removeFromCart } from './removeFromCart';
export { clearCart } from './clearCart';
export { addBundleToCart } from './addBundleToCart';
export { getCartCount } from './getCartCount';

// Product Endpoints
export { getProducts } from './getProducts';
export { getProductById, getProductBySlug } from './getProduct';
export { searchProducts } from './searchProducts';

// Category Endpoints
export { getCategories, getTopLevelCategories } from './getCategories';
export { getCategoryById, getCategoryBySlug } from './getCategory';

// Bundle Endpoints
export { getAllBundles, getFeaturedBundles } from './getBundles';
export { getBundle } from './getBundle';

// Authentication Endpoints
export { login } from './login';
export { register } from './register';
export { logout } from './logout';
export { forgotPassword } from './forgotPassword';
export { resetPassword } from './resetPassword';

// User Endpoints
export { getProfile } from './getProfile';
export { updateProfile } from './updateProfile';
export { getDashboard } from './getDashboard';
export { changePassword } from './changePassword';
export { deleteAccount } from './deleteAccount';

// Notification Endpoints
export { getNotifications, getUnreadNotificationsCount } from './getNotifications';
export { markNotificationRead } from './markNotificationRead';
export { markAllNotificationsRead } from './markAllNotificationsRead';

// Location Endpoints
export { getUserAddress } from './getUserAddress';
export { updateDeliveryAddress } from './updateDeliveryAddress';
export { getSectorsByPhase } from './getSectors';
export { getPhases } from './getPhases';
export { validateDeliveryLocation } from './validateDeliveryLocation';

// Order Endpoints
export { getOrders } from './getOrders';
export { getOrderDetails } from './getOrderDetails';
export { cancelOrder } from './cancelOrder';

// Checkout Endpoints
export { submitOrder } from './submitOrder';
export { getCheckoutData } from './getCheckoutData';

// ============================================
// USAGE EXAMPLES:
// ============================================

/**
 * Example 1: Import everything
 * import * as API from './api';
 * await API.AuthAPI.login(email, password);
 * await API.ProductAPI.searchProducts('rice');
 *
 * Example 2: Import specific modules
 * import { AuthAPI, ProductAPI, CartAPI } from './api';
 * await AuthAPI.login(email, password);
 * await ProductAPI.getProductBySlug('basmati-rice');
 * await CartAPI.addToCart({ product_id: 123, quantity: 2 });
 *
 * Example 3: Import specific functions
 * import { AuthAPI } from './api';
 * const { login, signup, logout } = AuthAPI;
 * await login(email, password);
 *
 * Example 4: Check server health
 * import { checkServerHealth } from './api';
 * const health = await checkServerHealth();
 * console.log('Server online:', health.online);
 */
