import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Notification {
  id: string;
  title: string;
  description: string;
  time?: string;
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Your order is on its way!',
      description: 'Track your Weekly Essentials Bundle in real time.',
    },
    {
      id: '2',
      title: 'Exclusive Offer: Save 15% today',
      description: 'Get discounts on Family Bundles. Limited time only.',
    },
    {
      id: '3',
      title: 'New Ad Posted in Your Area',
      description: 'A user just listed fresh electronics for sale near you.',
    },
    {
      id: '4',
      title: 'Hungry? Quick bites available now',
      description: 'Order samosas, rolls, and burgers straight from the canteen.',
    },
    {
      id: '5',
      title: 'Cart Reminder',
      description: 'You left 3 items in your cart. Complete your checkout now.',
    },
    {
      id: '6',
      title: 'Halfway there',
      description: "You've completed 3 of 5 Playweek activities. Just 2 more to go!",
    },
    {
      id: '7',
      title: 'Your Ad is Live',
      description: "We've published your listing. Start getting buyers today.",
    },
    {
      id: '8',
      title: 'Fresh Stock Alert',
      description: 'New fruits and vegetables just added. Shop now before they\'re gone.',
    },
    {
      id: '9',
      title: 'Bundle Restocked',
      description: 'Student Saver Bundle is back! Grab yours today.',
    },
    {
      id: '10',
      title: 'Profile Updated Successfully',
      description: 'Your details have been saved. Thanks for keeping your info current.',
    },
  ];

  const renderNotificationItem = (item: Notification) => (
    <TouchableOpacity key={item.id} style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        <View style={styles.notificationIcon}>
          <Text style={styles.bellIcon}>🔔</Text>
        </View>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>🔋</Text>
          </View>
        </View>
        
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Notifications</Text>
        
        <ScrollView 
          style={styles.notificationsContainer}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map(renderNotificationItem)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    color: '#334155',
    fontSize: 14,
  },
  topBar: {
    paddingVertical: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#334155',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  pageTitle: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    marginBottom: 20,
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 20,
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#CFFCE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 16,
    color: '#009D66',
  },
  notificationContent: {
    flex: 1,
    gap: 2,
  },
  notificationTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    lineHeight: 20,
  },
  notificationDescription: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    lineHeight: 18,
  },
});

export default NotificationsScreen;
