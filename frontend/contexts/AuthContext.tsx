// ============================================
// AUTH CONTEXT
// Centralized authentication state management
// ============================================

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthToken, removeAuthToken, setAuthToken, getUserData, setUserData } from '../api/axiosConfig';

// Types
interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   * Called on app startup
   */
  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication status...');

      const token = await getAuthToken();
      const userData = await getUserData();

      if (token && userData) {
        console.log('✅ User is authenticated');
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        console.log('❌ User is not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('⚠️ Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   * @param token - JWT token
   * @param userData - User information
   */
  const login = async (token: string, userData: User) => {
    try {
      console.log('🔐 Logging in user:', userData.email);
      console.log('🔐 User data:', JSON.stringify(userData));

      await setAuthToken(token);
      await setUserData(userData);

      setIsAuthenticated(true);
      setUser(userData);

      console.log('✅ User logged in successfully');
      console.log('✅ Auth state updated - isAuthenticated: true');
    } catch (error) {
      console.error('⚠️ Error during login:', error);
      throw error;
    }
  };

  /**
   * Logout user
   * Clears all auth data
   */
  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');

      await removeAuthToken();

      setIsAuthenticated(false);
      setUser(null);

      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('⚠️ Error during logout:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
