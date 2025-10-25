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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: keyof RootStackParamList;
  action?: 'logout';
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock user data - in production, fetch from API
  const user = {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
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

  const handleLogout = () => {
    setShowLogoutModal(false);
    // TODO: Clear auth token and navigate to login
    navigation.navigate('Login');
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
            <Ionicons name="create-outline" size={20} color="#00A86B" />
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
                  color={item.action === 'logout' ? '#E53935' : '#00A86B'}
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
              <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={48} color="#E53935" />
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E5E5',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  logoutItem: {
    backgroundColor: '#FFEBEE',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  logoutTitle: {
    color: '#E53935',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  modalMessage: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#777',
    fontFamily: 'Poppins',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default ProfileScreen;
