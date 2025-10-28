// ============================================
// MAIN STACK NAVIGATOR
// All authenticated screens with bottom tabs
// ============================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';

// Stack Screens (on top of bottom tabs)
import AddLocationScreen from '../screens/AddLocationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import CartScreen from '../screens/CartScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SavedAddressesScreen from '../screens/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../screens/AddPaymentMethodScreen';
import AddNewAddressScreen from '../screens/AddNewAddressScreen';
import AddNewAddressConfirmScreen from '../screens/AddNewAddressConfirmScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import CreateAdScreen from '../screens/CreateAdScreen';
import CreateAdFlow from '../screens/CreateAdFlow';
import GroceryListScreen from '../screens/GroceryListScreen';
import GroceryScreen from '../screens/GroceryScreen';
import MarketplaceProductDetailScreen from '../screens/MarketplaceProductDetailScreen';
import ContactSellerScreen from '../screens/ContactSellerScreen';
import OrderConfirmedScreen from '../screens/OrderConfirmedScreen';
import PreparingScreen from '../screens/PreparingScreen';
import OnTheWayScreen from '../screens/OnTheWayScreen';
import DeliveredScreen from '../screens/DeliveredScreen';
import FilterModalScreen from '../screens/FilterModalScreen';
import FilterModalWithSelectionsScreen from '../screens/FilterModalWithSelectionsScreen';
import NetworkDiagnosticScreen from '../screens/NetworkDiagnosticScreen';
import MessagesScreen from '../screens/MessagesScreen';

// Type definitions for all screens
export type MainStackParamList = {
  MainTabs: undefined; // Bottom tab navigator
  Messages: undefined; // Chatbot/Messages screen (accessed via floating button)
  AddLocation: undefined;
  EditProfile: undefined;
  ProductDetail: { productId: string };
  ProductListing: { categoryId?: string; searchQuery?: string };
  Cart: undefined;
  Notifications: undefined;
  Security: undefined;
  SavedAddresses: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  AddNewAddress: undefined;
  AddNewAddressConfirm: { address: any };
  ContactUs: undefined;
  CreateAd: undefined;
  CreateAdFlow: undefined;
  GroceryList: undefined;
  Grocery: undefined;
  MarketplaceProductDetail: { productId: string };
  ContactSeller: { sellerId: string };
  OrderConfirmed: { orderId?: string };
  Preparing: { orderId?: string };
  OnTheWay: { orderId?: string };
  Delivered: { orderId?: string };
  FilterModal: { filters?: any };
  FilterModalWithSelections: { filters?: any };
  NetworkDiagnostic: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {/* Bottom Tab Navigator (Home, Categories, Sell, Chat, Profile) */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Location Screens */}
      <Stack.Screen name="AddLocation" component={AddLocationScreen} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
      <Stack.Screen name="AddNewAddressConfirm" component={AddNewAddressConfirmScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />

      {/* Profile Screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />

      {/* Shopping Screens */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Grocery" component={GroceryScreen} />
      <Stack.Screen name="GroceryList" component={GroceryListScreen} />

      {/* Filter Screens */}
      <Stack.Screen
        name="FilterModal"
        component={FilterModalScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="FilterModalWithSelections"
        component={FilterModalWithSelectionsScreen}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />

      {/* Payment Screens */}
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />

      {/* Order Screens */}
      <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
      <Stack.Screen name="Preparing" component={PreparingScreen} />
      <Stack.Screen name="OnTheWay" component={OnTheWayScreen} />
      <Stack.Screen name="Delivered" component={DeliveredScreen} />

      {/* Marketplace/Ads Screens */}
      <Stack.Screen name="CreateAd" component={CreateAdScreen} />
      <Stack.Screen name="CreateAdFlow" component={CreateAdFlow} />
      <Stack.Screen name="MarketplaceProductDetail" component={MarketplaceProductDetailScreen} />
      <Stack.Screen name="ContactSeller" component={ContactSellerScreen} />

      {/* Communication Screens */}
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />

      {/* Developer/Debug Screens */}
      <Stack.Screen name="NetworkDiagnostic" component={NetworkDiagnosticScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
