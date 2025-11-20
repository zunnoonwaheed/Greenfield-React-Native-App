// ============================================
// ROOT NAVIGATOR
// Switches between Auth and Main stacks based on authentication
// ============================================

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { Colors } from '../constants/theme';

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Log auth state changes
  useEffect(() => {
    console.log('🔐 RootNavigator: Auth state changed');
    console.log(`   - isAuthenticated: ${isAuthenticated}`);
    console.log(`   - isLoading: ${isLoading}`);
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('🔄 RootNavigator: Loading auth state...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Switch between Auth and Main stacks based on authentication status
  console.log(`📱 RootNavigator: Rendering ${isAuthenticated ? 'MainStack (authenticated)' : 'AuthStack (not authenticated)'}`);
  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

export default RootNavigator;
