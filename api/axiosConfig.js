// ============================================
// ✅ AXIOS BASE CONFIGURATION (Expo + React Native)
// Centralized Axios setup with retry logic and timeout handling
// ============================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 🔹 Replace with your local machine IP (from `ifconfig` or `ipconfig`)
const LOCAL_IP = '192.168.100.222';

// ============================================
// Detect environment and platform
// ============================================
let API_BASE_URL = '';

if (__DEV__) {
  if (Platform.OS === 'ios') {
    // iOS simulator can use localhost or actual IP
    API_BASE_URL = `http://${LOCAL_IP}:3000/api`;
  } else if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // Physical Android devices must use the local IP
    API_BASE_URL = 'http://10.0.2.2:3000/api';
  } else {
    API_BASE_URL = `http://${LOCAL_IP}:3000/api`;
  }
} else {
  // 🔒 Production endpoint
  API_BASE_URL = 'https://your-production-domain.com/api';
}

console.log(`📡 Using API Base URL: ${API_BASE_URL}`);
console.log(`📱 Platform: ${Platform.OS}`);

// ============================================
// Create Axios instance with increased timeout
// ============================================
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 🔥 Increased to 30 seconds for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// RETRY CONFIGURATION
// Automatically retry failed requests
// ============================================
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const shouldRetry = (error) => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (!error.response) {
    // Network error (no response received)
    return true;
  }

  const status = error.response.status;
  // Retry on server errors (500-599) but not on client errors (400-499)
  return status >= 500 && status <= 599;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// REQUEST INTERCEPTOR
// Attaches JWT token automatically if present
// ============================================
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // Ensure headers exist
      if (!config.headers) {
        config.headers = {};
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Initialize retry counter
      if (!config.retryCount) {
        config.retryCount = 0;
      }

      const retryInfo = config.retryCount > 0 ? ` (Retry ${config.retryCount}/${MAX_RETRIES})` : '';
      console.log(`➡️ Request: ${config.method?.toUpperCase()} ${config.url}${retryInfo}`);

      return config;
    } catch (err) {
      console.error('⚠️ Request interceptor error:', err);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request setup failed:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// Handles errors gracefully with retry logic
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} → ${response.config.url}`);
    return response.data;
  },
  async (error) => {
    const config = error.config;

    // Handle retry logic
    if (shouldRetry(error) && config && config.retryCount < MAX_RETRIES) {
      config.retryCount = (config.retryCount || 0) + 1;

      const delay = RETRY_DELAY * config.retryCount;
      console.log(`⏳ Retrying request in ${delay}ms... (Attempt ${config.retryCount}/${MAX_RETRIES})`);

      await wait(delay);
      return axiosInstance(config);
    }

    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - server took too long to respond');
    } else if (error.message === 'Network Error') {
      console.error('🌐 Network error - check if server is running');
    } else {
      console.error('❌ API Error:', error.response?.data || error.message);
    }

    // Handle response errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.warn('🔐 Unauthorized — clearing token.');
          await AsyncStorage.multiRemove(['authToken', 'userData']);
          return Promise.reject({
            message: 'Session expired. Please login again.',
            code: 'UNAUTHORIZED',
          });

        case 403:
          console.warn('🚫 Forbidden.');
          return Promise.reject({
            message: 'Access denied.',
            code: 'FORBIDDEN',
          });

        case 404:
          console.warn('❓ Resource not found.');
          return Promise.reject({
            message: 'The requested resource was not found.',
            code: 'NOT_FOUND',
          });

        case 500:
          console.warn('💥 Internal server error.');
          return Promise.reject({
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR',
          });

        case 503:
          console.warn('🚧 Service unavailable.');
          return Promise.reject({
            message: 'Service temporarily unavailable. Please try again.',
            code: 'SERVICE_UNAVAILABLE',
          });
      }

      return Promise.reject(data || { message: 'Server error', code: 'UNKNOWN' });
    }

    // Handle network errors (no response received)
    if (error.request) {
      console.error('🌐 No response from server');

      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          message: 'Request timeout. The server is taking too long to respond. Please check your connection and try again.',
          code: 'TIMEOUT',
        });
      }

      return Promise.reject({
        message: 'Cannot connect to server. Please check:\n• Is the backend server running?\n• Is your device connected to WiFi?\n• Is your IP address correct?',
        code: 'NETWORK_ERROR',
        details: {
          baseURL: API_BASE_URL,
          platform: Platform.OS,
        },
      });
    }

    // Handle other errors
    return Promise.reject({
      message: error.message || 'An unexpected error occurred.',
      code: 'UNKNOWN_ERROR',
    });
  }
);

// ============================================
// HEALTH CHECK UTILITY
// Check if backend is reachable before making requests
// ============================================
export const checkServerHealth = async () => {
  try {
    // Remove '/api' from base URL for health check
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await axios.get(`${baseUrl}/health`, {
      timeout: 5000, // 5 second timeout for health check
    });

    console.log('✅ Server health check passed:', response.data);
    return {
      success: true,
      online: true,
      message: 'Server is reachable',
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return {
      success: false,
      online: false,
      message: 'Server is not reachable',
      error: error.message,
      url: API_BASE_URL,
    };
  }
};

// ============================================
// NETWORK DIAGNOSTIC UTILITY
// Provides detailed network information for debugging
// ============================================
export const getNetworkDiagnostics = async () => {
  const diagnostics = {
    platform: Platform.OS,
    apiBaseUrl: API_BASE_URL,
    localIP: LOCAL_IP,
    isDevelopment: __DEV__,
  };

  try {
    const healthCheck = await checkServerHealth();
    diagnostics.serverOnline = healthCheck.online;
    diagnostics.healthCheckResponse = healthCheck;
  } catch (error) {
    diagnostics.serverOnline = false;
    diagnostics.healthCheckError = error.message;
  }

  console.log('🔍 Network Diagnostics:', diagnostics);
  return diagnostics;
};

// ============================================
// STORAGE HELPERS (AsyncStorage)
// ============================================

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('🔑 Auth token stored');
  } catch (err) {
    console.error('Error storing auth token:', err);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (err) {
    console.error('Error retrieving auth token:', err);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    console.log('🚮 Auth token removed');
  } catch (err) {
    console.error('Error removing auth token:', err);
  }
};

export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log('👤 User data stored');
  } catch (err) {
    console.error('Error storing user data:', err);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error retrieving user data:', err);
    return null;
  }
};

// ============================================
// EXPORT API BASE URL (for reference)
// ============================================
export { API_BASE_URL };

// ============================================
// EXPORT DEFAULT INSTANCE
// ============================================
export default axiosInstance;
