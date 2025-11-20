/**
 * NotificationsScreen - Notification List
 * Display list of user notifications
 */

import React from 'react';
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

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Your order is on its way!',
      description: 'Track your Weekly Essentials Bundle in real...',
      time: '2h ago',
      read: false,
    },
    {
      id: '2',
      title: 'Exclusive Offer: Save 15% today',
      description: 'Get discounts on Family Bundles. Limited ti...',
      time: '5h ago',
      read: false,
    },
    {
      id: '3',
      title: 'New Ad Posted in Your Area',
      description: 'A user just listed fresh electronics for sale...',
      time: '1d ago',
      read: false,
    },
    {
      id: '4',
      title: 'Hungry? Quick bites available now',
      description: 'Order samosas, rolls, and burgers straight f...',
      time: '1d ago',
      read: false,
    },
    {
      id: '5',
      title: 'Cart Reminder',
      description: 'You left 3 items in your cart. Complete your...',
      time: '2d ago',
      read: true,
    },
    {
      id: '6',
      title: 'Halfway there',
      description: "You've completed 3 of 5 Playweek activitie...",
      time: '2d ago',
      read: true,
    },
    {
      id: '7',
      title: 'Your Ad is Live',
      description: "We've published your listing. Start getting b...",
      time: '3d ago',
      read: true,
    },
    {
      id: '8',
      title: 'Fresh Stock Alert',
      description: 'New fruits and vegetables just added. Shop...',
      time: '3d ago',
      read: true,
    },
    {
      id: '9',
      title: 'Bundle Restocked',
      description: 'Student Saver Bundle is back! Grab yours t...',
      time: '4d ago',
      read: true,
    },
    {
      id: '10',
      title: 'Profile Updated Successfully',
      description: 'Your profile information has been updated...',
      time: '5d ago',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Image
            source={require('../images/homepage-assets/arrow.png')}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require('../images/homepage-assets/notification-bell.png')}
                style={styles.notificationIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription} numberOfLines={1}>
                {notification.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIcon: {
    width: 28,
    height: 28,
    tintColor: '#059669',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  notificationDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontFamily: 'DM Sans',
  },
});

export default NotificationsScreen;