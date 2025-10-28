/**
 * ProfileScreen - User Profile & Settings
 * Clean, minimal design with menu options
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: keyof MainStackParamList;
  action?: 'logout';
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout: authLogout, user: authUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Use user data from AuthContext or fallback to mock
  const user = {
    name: authUser?.name || 'User',
    email: authUser?.email || 'user@example.com',
    avatar: require('../images/homepage-assets/home-shop-category.png'), // Placeholder
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Address & Delivery',
      subtitle: 'Edit added address details',
      icon: 'location-outline',
      route: 'SavedAddresses',
    },
    {
      id: '2',
      title: 'Payment & Payouts',
      subtitle: 'View payments & transaction history',
      icon: 'card-outline',
      route: 'PaymentMethods',
    },
    {
      id: '3',
      title: 'Order & Activity History',
      subtitle: 'Track your orders & past purchases',
      icon: 'receipt-outline',
    },
    {
      id: '4',
      title: 'Notifications',
      subtitle: 'Choose what alerts & updates you receive',
      icon: 'notifications-outline',
      route: 'Notifications',
    },
    {
      id: '5',
      title: 'Privacy & Security',
      subtitle: 'Update password & account security',
      icon: 'shield-checkmark-outline',
      route: 'Security',
    },
    {
      id: '6',
      title: 'Help',
      subtitle: 'Find answers or contact support staff',
      icon: 'help-circle-outline',
      route: 'ContactUs',
    },
    {
      id: '7',
      title: 'Logout',
      subtitle: 'Sign out from the platform',
      icon: 'log-out-outline',
      action: 'logout',
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action === 'logout') {
      setShowLogoutModal(true);
    } else if (item.route) {
      navigation.navigate(item.route as any);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);

    try {
      await authLogout();
      console.log('✅ Logout successful - switching to Auth Stack');
      // User will be redirected to AuthStack automatically via AuthContext
    } catch (error) {
      console.error('⚠️ Logout error:', error);
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={Spacing.screenPadding} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.action === 'logout' && styles.logoutItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                item.action === 'logout' && styles.logoutIconContainer,
              ]}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.action === 'logout' ? Colors.error : Colors.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={[
                  styles.menuTitle,
                  item.action === 'logout' && styles.logoutTitle,
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={Spacing.screenPadding} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={48} color={Colors.error} />
            </View>
            <Text style={styles.modalTitle}>Confirm Logout?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out? Unsaved changes may be lost, but your data will remain secure.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.black,
    fontFamily: 'Poppins',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.screenPadding,
    padding: Spacing.screenPadding,
    borderRadius: BorderRadius.medium,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Spacing.xl,
    backgroundColor: Colors.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  userName: {
    fontSize: Typography.h5,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins',
  },
  userEmail: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  editButton: {
    width: Layout.avatarSize,
    height: Layout.avatarSize,
    borderRadius: Spacing.screenPadding,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.screenPadding,
    marginBottom: Spacing.screenPadding,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundGray,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  logoutItem: {
    backgroundColor: Colors.backgroundGray,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.gap,
  },
  logoutIconContainer: {
    backgroundColor: Colors.backgroundGray,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.bodySmall + 1,
    fontWeight: Typography.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins',
  },
  logoutTitle: {
    color: Colors.error,
  },
  menuSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.large,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: Layout.avatarSize * 2,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  modalTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.gap,
    fontFamily: 'Poppins',
  },
  modalMessage: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
    marginBottom: Spacing.large,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.gap,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    paddingVertical: Typography.bodySmall,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.bodySmall + 1,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: Typography.bodySmall,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: Typography.bodySmall + 1,
    fontWeight: Typography.bold,
    color: Colors.white,
    fontFamily: 'Poppins',
  },
});

export default ProfileScreen;
