// ============================================
// APP.TSX
// Main application entry point with proper navigation and authentication
// ============================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Linking } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';

// Deep linking configuration for password reset and email verification
const linking = {
  prefixes: ['greenfield://', 'https://greenfieldsupermarket.com'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
      },
      VerifyEmail: {
        path: 'verify-email',
        parse: {
          token: (token: string) => token,
        },
      },
      // Add other screens as needed
    },
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer linking={linking} fallback={<StatusBar barStyle="dark-content" />}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
