import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
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
import GroceryListScreen from './screens/GroceryListScreen';
import FilterModalScreen from './screens/FilterModalScreen';
import FilterModalWithSelectionsScreen from './screens/FilterModalWithSelectionsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import ProductListingScreen from './screens/ProductListingScreen';
import SavedAddressesScreen from './screens/SavedAddressesScreen';
import AddNewAddressScreen from './screens/AddNewAddressScreen';
import AddNewAddressConfirmScreen from './screens/AddNewAddressConfirmScreen';
import MessagesScreen from './screens/MessagesScreen';
import SellAdsScreen from './screens/SellAdsScreen';
import MarketplaceProductDetailScreen from './screens/MarketplaceProductDetailScreen';
import ContactSellerScreen from './screens/ContactSellerScreen';
import CreateAdScreen from './screens/CreateAdScreen';
import CreateAdFlow from './screens/CreateAdFlow';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ContactUsScreen from './screens/ContactUsScreen';
import SecurityScreen from './screens/SecurityScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from './screens/AddPaymentMethodScreen';
import OrderConfirmedScreen from './screens/OrderConfirmedScreen';
import PreparingScreen from './screens/PreparingScreen';
import OnTheWayScreen from './screens/OnTheWayScreen';
import DeliveredScreen from './screens/DeliveredScreen';
import { getAuthToken} from './api/axiosConfig';

export type RootStackParamList = {
  LocationPermission: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  SignUp: undefined;
  AddLocation: undefined;
  Welcome: undefined;
  Home: undefined;
  HomescreenNew: undefined;
  Notifications: undefined;
  Categories: undefined;
  GroceryList: undefined;
  GroceryListScreen: undefined;
  FilterModal: undefined;
  FilterModalWithSelections: undefined;
  ProductDetail: undefined;
  Cart: undefined;
  ProductListing: undefined;
  SavedAddresses: undefined;
  AddNewAddress: undefined;
  AddNewAddressConfirm: { totalAmount?: number; cartItems?: any[] } | undefined;
  Messages: undefined;
  SellAds: undefined;
  MarketplaceProductDetail: { product: any } | undefined;
  ContactSeller: { product: any } | undefined;
  CreateAd: undefined;
  CreateAdFlow: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ContactUs: undefined;
  Security: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  OrderConfirmed: undefined;
  Preparing: undefined;
  OnTheWay: undefined;
  Delivered: undefined;
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
    <>
      <StatusBar hidden={true} />
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
        <Stack.Screen name="HomescreenNew" component={HomescreenNew} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="GroceryList" component={GroceryScreen} />
        <Stack.Screen name="GroceryListScreen" component={GroceryListScreen} />
        <Stack.Screen name="FilterModal" component={FilterModalScreen} />
        <Stack.Screen name="FilterModalWithSelections" component={FilterModalWithSelectionsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="ProductListing" component={ProductListingScreen} />
        <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
        <Stack.Screen name="AddNewAddressConfirm" component={AddNewAddressConfirmScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="SellAds" component={SellAdsScreen} />
        <Stack.Screen name="MarketplaceProductDetail" component={MarketplaceProductDetailScreen} />
        <Stack.Screen name="ContactSeller" component={ContactSellerScreen} />
        <Stack.Screen name="CreateAd" component={CreateAdScreen} />
        <Stack.Screen name="CreateAdFlow" component={CreateAdFlow} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />

        {/* Order Tracking Screens */}
        <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
        <Stack.Screen name="Preparing" component={PreparingScreen} />
        <Stack.Screen name="OnTheWay" component={OnTheWayScreen} />
        <Stack.Screen name="Delivered" component={DeliveredScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </>
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
