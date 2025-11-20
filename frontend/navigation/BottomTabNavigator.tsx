// ============================================
// BOTTOM TAB NAVIGATOR
// Persistent bottom tabs for main app screens
// ============================================

import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Spacing } from '../constants/theme';

// Tab Screens
import HomescreenNew from '../screens/HomescreenNew';
import CategoriesScreen from '../screens/CategoriesScreen';
import SellAdsScreen from '../screens/SellAdsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type BottomTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  SellAdsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: 'DM Sans',
        },
        tabBarStyle: {
          height: 75,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomescreenNew}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../images/homepage-assets/home1.png')}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#059669' : '#64748B',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../images/homepage-assets/categories1.png')}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#059669' : '#64748B',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="SellAdsTab"
        component={SellAdsScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../images/homepage-assets/sell-icon.png')}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#059669' : '#64748B',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../images/homepage-assets/profile1.png')}
              style={{
                width: 26,
                height: 26,
                tintColor: focused ? '#059669' : '#64748B',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
