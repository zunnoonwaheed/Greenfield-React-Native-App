import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationPermissionScreen from './screens/LocationPermissionScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SignUpScreen from './screens/SignUpScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomescreenNew from './screens/HomescreenNew';
import NotificationsScreen from './screens/NotificationsScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import GroceryScreen from './screens/GroceryScreen';
import FilterModalScreen from './screens/FilterModalScreen';
import FilterModalWithSelectionsScreen from './screens/FilterModalWithSelectionsScreen';
import { getAuthToken } from './api/axiosConfig';

export type RootStackParamList = {
  LocationPermission: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  SignUp: undefined;
  AddLocation: undefined;
  Welcome: undefined;
  Home: undefined;
  Notifications: undefined;
  Categories: undefined;
  GroceryList: undefined;
  FilterModal: undefined;
  FilterModalWithSelections: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing auth token on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getAuthToken();
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#026A49" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Welcome" : "LocationPermission"}
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow Screens */}
        <Stack.Screen
          name="LocationPermission"
          component={LocationPermissionScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AddLocation" component={AddLocationScreen} />

        {/* Main App Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomescreenNew} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="GroceryList" component={GroceryScreen} />
        <Stack.Screen name="FilterModal" component={FilterModalScreen} />
        <Stack.Screen name="FilterModalWithSelections" component={FilterModalWithSelectionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});