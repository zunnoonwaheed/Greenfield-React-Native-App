// ============================================
// AUTH STACK NAVIGATOR
// All authentication-related screens
// ============================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import LocationPermissionScreen from '../screens/LocationPermissionScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AddLocationScreen from '../screens/AddLocationScreen';

// Type definitions
export type AuthStackParamList = {
  LocationPermission: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  Welcome: undefined;
  AddLocation: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LocationPermission"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="AddLocation"
        component={AddLocationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
