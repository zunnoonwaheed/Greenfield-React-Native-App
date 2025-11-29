/**
 * NotificationsScreen - Notification List
 * Display list of user notifications - Dynamic from Backend
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getNotifications } from '../api/getNotifications';

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications({ limit: 20 });
      if (response && response.notifications) {
        // Transform backend data to match frontend interface
        const transformedNotifications: Notification[] = response.notifications.map((notif: any) => ({
          id: String(notif.id),
          title: notif.title,
          description: notif.description || notif.message || '',
          time: notif.time || 'Just now',
          read: notif.read === true || notif.is_read === 1,
        }));
        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        ) : notifications.map((notification) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
});

export default NotificationsScreen;