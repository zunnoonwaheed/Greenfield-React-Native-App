/**
 * NotificationsScreen - Notification Preferences
 * Toggle settings for different notification types
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'all',
      title: 'All Notifications',
      description: 'Enable or disable all notifications',
      icon: 'notifications',
      enabled: true,
    },
    {
      id: 'orders',
      title: 'Order Updates',
      description: 'Get notified about your order status',
      icon: 'cube-outline',
      enabled: true,
    },
    {
      id: 'price',
      title: 'Price Drop Alerts',
      description: 'Be alerted when prices drop on saved items',
      icon: 'pricetag-outline',
      enabled: true,
    },
    {
      id: 'promo',
      title: 'Promotional Offers',
      description: 'Receive special deals and promotions',
      icon: 'gift-outline',
      enabled: false,
    },
    {
      id: 'chat',
      title: 'Chat / Message Notifications',
      description: 'New messages from sellers or support',
      icon: 'chatbubble-outline',
      enabled: true,
    },
    {
      id: 'updates',
      title: 'App Updates & Announcements',
      description: 'New features and important announcements',
      icon: 'megaphone-outline',
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
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
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={20} color="#00A86B" />
          <Text style={styles.infoBannerText}>
            Manage your notification preferences to stay updated
          </Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsContainer}>
          {settings.map((setting, index) => (
            <View
              key={setting.id}
              style={[
                styles.settingCard,
                index === settings.length - 1 && styles.lastSettingCard,
              ]}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name={setting.icon}
                  size={24}
                  color={setting.enabled ? '#00A86B' : '#9E9E9E'}
                />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{ false: '#E5E5E5', true: '#A8E6CF' }}
                thumbColor={setting.enabled ? '#00A86B' : '#F5F5F5'}
                ios_backgroundColor="#E5E5E5"
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#00A86B',
    lineHeight: 18,
  },
  settingsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lastSettingCard: {
    marginBottom: 0,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  settingDescription: {
    fontSize: 12,
    color: '#777',
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default NotificationsScreen;
