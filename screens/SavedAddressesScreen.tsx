/**
 * SavedAddressesScreen - Display and manage saved delivery addresses
 *
 * Usage as Modal:
 * ```tsx
 * const [showAddresses, setShowAddresses] = useState(false);
 *
 * <SavedAddressesScreen
 *   visible={showAddresses}
 *   onClose={() => setShowAddresses(false)}
 *   asModal={true}
 * />
 * ```
 *
 * Usage as Screen (via navigation):
 * ```tsx
 * navigation.navigate('SavedAddresses');
 * ```
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getLocations } from '../api/locationAPI';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type SavedAddressesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface UserLocation {
  id: number;
  city: string;
  area: string;
  sector: string;
  street_number: string;
  property_type: string;
  house_number: string;
  is_default: boolean;
}

interface SavedAddressesScreenProps {
  visible?: boolean;
  onClose?: () => void;
  onAddNewAddress?: () => void;
  asModal?: boolean;
}

const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
  visible = true,
  onClose,
  onAddNewAddress,
  asModal = false,
}) => {
  const navigation = useNavigation<SavedAddressesScreenNavigationProp>();
  const [addresses, setAddresses] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!asModal || visible) {
      fetchAddresses();
    }
  }, [visible, asModal]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getLocations();
      // Response interceptor unwraps response.data, so access locations directly
      if (response && response.success && response.locations) {
        setAddresses(response.locations);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (location: UserLocation): string => {
    const parts = [];
    
    if (location.property_type && location.house_number) {
      const propertyPrefix = location.property_type === 'house' ? 'House' : 'Apartment';
      parts.push(`${propertyPrefix} ${location.house_number}`);
    }
    
    if (location.street_number) {
      parts.push(`St. ${location.street_number}`);
    }
    
    if (location.sector) {
      parts.push(location.sector);
    }
    
    if (location.area) {
      parts.push(location.area);
    }
    
    if (location.city) {
      parts.push(location.city);
    }
    
    return parts.join(', ');
  };

  const getAddressLabel = (location: UserLocation): string => {
    if (location.area && location.sector) {
      return `${location.area} - ${location.sector}`;
    }
    return location.area || location.sector || location.city || 'Address';
  };

  const handleAddNewAddress = () => {
    if (onClose) {
      onClose();
    }
    if (onAddNewAddress) {
      onAddNewAddress();
    } else {
      navigation.navigate('AddNewAddress');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  const renderAddressItem = ({ item }: { item: UserLocation }) => (
    <View style={styles.addressItem}>
      <View style={styles.addressContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={20} color={Colors.primary} />
        </View>
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressLabel} numberOfLines={1}>
            {getAddressLabel(item)}
          </Text>
          <Text style={styles.addressDetail} numberOfLines={1}>
            {formatAddress(item)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={asModal ? styles.modalContainer : styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Addresses</Text>
        <TouchableOpacity
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={Layout.iconSize} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.addressList}
          showsVerticalScrollIndicator={false}
        >
          {addresses.length > 0 ? (
            addresses.map((item) => (
              <View key={item.id}>
                {renderAddressItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No saved addresses</Text>
              <Text style={styles.emptySubtext}>
                Add your first address to get started
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (asModal) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          {renderContent()}
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.screenWrapper}>
      <View style={styles.screenOverlay}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  screenOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.screenPadding,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  screenContainer: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.screenPadding,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  title: {
    fontSize: Typography.subheading,
    fontWeight: Typography.bold,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  addressList: {
    marginBottom: Spacing.large,
  },
  addressItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.gap,
    paddingHorizontal: Spacing.medium,
    paddingRight: Spacing.screenPadding,
    marginBottom: Spacing.gap,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gap,
  },
  iconContainer: {
    width: Spacing.xl,
    height: Spacing.xl,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContainer: {
    flex: 1,
    gap: 2,
  },
  addressLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  addressDetail: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.small,
  },
  emptyText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginTop: Spacing.gap,
  },
  emptySubtext: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: Spacing.gap,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.button,
    paddingVertical: 14,
    paddingHorizontal: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  closeButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
});

export default SavedAddressesScreen;
