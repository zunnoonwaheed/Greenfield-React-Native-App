/**
 * ProfileScreen - User Profile & Settings - Dynamic from Backend
 * Clean, minimal design with menu options
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../api/userAPI';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type ProfileScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any; // Image source
  route?: keyof MainStackParamList;
  action?: 'logout';
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout: authLogout, user: authUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const result = await getProfile();
      if (result.success && result.data?.user) {
        setUserData(result.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  // Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  // Use fetched user data or fallback to AuthContext
  const user = {
    name: userData?.name || authUser?.name || 'User',
    email: userData?.email || authUser?.email || 'user@example.com',
    phone: userData?.phone || '',
    avatar: require('../images/homepage-assets/profilepic.png'),
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Address & Delivery',
      subtitle: 'Manage your delivery addresses',
      icon: require('../images/package-profile.png'),
      route: 'SavedAddresses',
    },
    {
      id: '2',
      title: 'Payment & Payouts',
      subtitle: 'Manage your payment methods',
      icon: require('../images/receipt.png'),
      route: 'PaymentMethods',
    },
    {
      id: '3',
      title: 'Order & Activity History',
      subtitle: 'View your past orders',
      icon: require('../images/homepage-assets/square-activity.png'),
      route: 'OrderHistory',
    },
    {
      id: '4',
      title: 'Notifications',
      subtitle: 'View all notifications',
      icon: require('../images/bell-ring.png'),
      route: 'Notifications',
    },
    {
      id: '5',
      title: 'Privacy & Security',
      subtitle: 'Change your password',
      icon: require('../images/fingerprint.png'),
      route: 'Security',
    },
    {
      id: '6',
      title: 'Help & Support',
      subtitle: 'Contact support team',
      icon: require('../images/circle-question-mark.png'),
      route: 'ContactUs',
    },
    {
      id: '7',
      title: 'Logout',
      subtitle: 'Sign out from the platform',
      icon: require('../images/Outline.png'),
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={user.avatar}
            style={styles.profilePic}
            resizeMode="cover"
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>

            {/* Email Section */}
            <View style={styles.contactRow}>
              <Image
                source={require('../images/homepage-assets/messege-box.png')}
                style={styles.contactIcon}
                resizeMode="contain"
              />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/settings.png')}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={item.icon}
                  style={styles.menuIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalIconContainer}
              onPress={() => setShowLogoutModal(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirm Logout?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out? Unsaved changes may be lost, but your data will remain secure.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
    marginTop: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  contactText: {
    fontSize: 13,
    color: '#6C757D',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 28,
    height: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6C757D',
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
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-start',
  },
  modalIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
