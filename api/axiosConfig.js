// ============================================
// AXIOS BASE CONFIGURATION
// Centralized Axios setup for all API calls
// ============================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ============================================
// BASE API URL CONFIGURATION
// ============================================

// ⚠️ IMPORTANT: Use your laptop's Wi-Fi IP so your mobile device can connect
const LOCAL_IP = '192.168.100.216';
const PORT = '3001';

// For testing on physical device
const API_BASE_URL = `http://${LOCAL_IP}:${PORT}/api`;

// For emulators/simulators
// iOS simulator: 'http://127.0.0.1:3001/api'
// Android emulator: 'http://10.0.2.2:3001/api'

// For production
// const API_BASE_URL = 'https://your-production-domain.com/api';

console.log('🌐 API Base URL:', API_BASE_URL);

// ============================================
// CREATE AXIOS INSTANCE
// ============================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (increased for slow connections)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// Automatically add auth token to every request
// ============================================

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
      return config;
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// Handles success and error responses
// ============================================

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  async (error) => {
    console.error('⚠️ API Error:', error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.warn('🔒 Unauthorized — clearing token');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          break;
        case 403:
          console.error('🚫 Forbidden — access denied');
          break;
        case 404:
          console.error('❓ Resource not found');
          break;
        case 500:
          console.error('💥 Server error');
          break;
        default:
          console.error(`Unhandled API status: ${status}`);
      }

      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response received (timeout or network issue)
      return Promise.reject({
        success: false,
        message:
          'Network is slow or unavailable. Please check your connection and try again.',
      });
    } else {
      // Other unexpected errors
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log('🔐 Auth token stored');
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    console.log('🚪 Auth token removed');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log('👤 User data stored');
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export default axiosInstance;
