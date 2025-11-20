/**
 * NotificationSettingsScreen - Manage Notification Preferences
 * Toggle switches for different notification types
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

type NotificationSettingsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface NotificationSetting {
  id: string;
  label: string;
  value: boolean;
}

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationSettingsScreenNavigationProp>();

  const [allNotifications, setAllNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);

  const handleAllNotificationsToggle = (value: boolean) => {
    setAllNotifications(value);
    // If turning all off, turn off all other notifications
    if (!value) {
      setOrderUpdates(false);
      setPriceDropAlerts(false);
      setPromotionalOffers(false);
      setChatNotifications(false);
      setAppUpdates(false);
    } else {
      // If turning all on, turn on all other notifications
      setOrderUpdates(true);
      setPriceDropAlerts(true);
      setPromotionalOffers(true);
      setChatNotifications(true);
      setAppUpdates(true);
    }
  };

  const handleSave = () => {
    // TODO: API call to save notification preferences
    Alert.alert(
      'Settings Saved',
      'Your notification preferences have been updated successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../images/homepage-assets/arrow-back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* All Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>All Notifications</Text>
          <Switch
            value={allNotifications}
            onValueChange={handleAllNotificationsToggle}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Order Updates */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Order Updates</Text>
          <Switch
            value={orderUpdates}
            onValueChange={setOrderUpdates}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Price Drop Alerts */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Price Drop Alerts</Text>
          <Switch
            value={priceDropAlerts}
            onValueChange={setPriceDropAlerts}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Promotional Offers */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Promotional Offers</Text>
          <Switch
            value={promotionalOffers}
            onValueChange={setPromotionalOffers}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Chat / Message Notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Chat / Message Notifications</Text>
          <Switch
            value={chatNotifications}
            onValueChange={setChatNotifications}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* App Updates & Announcements */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>App Updates & Announcements</Text>
          <Switch
            value={appUpdates}
            onValueChange={setAppUpdates}
            trackColor={{ false: '#E5E7EB', true: '#34D399' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default NotificationSettingsScreen;
