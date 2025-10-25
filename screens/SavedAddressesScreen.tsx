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
      if (response.success && response.data?.locations) {
        setAddresses(response.data.locations);
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
          <Ionicons name="location" size={20} color="#009D66" />
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
          <Ionicons name="close" size={24} color="#475569" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#026A49" />
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
              <Ionicons name="location-outline" size={48} color="#CBD5E1" />
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
    backgroundColor: '#FCFCFC',
  },
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    padding: 20,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  screenContainer: {
    width: '100%',
    maxWidth: 366,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    padding: 20,
    paddingBottom: 28,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  addressList: {
    marginBottom: 24,
  },
  addressItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    paddingHorizontal: 16,
    paddingRight: 20,
    marginBottom: 12,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#CFFCE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextContainer: {
    flex: 1,
    gap: 2,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  addressDetail: {
    fontSize: 14,
    fontWeight: '400',
    color: '#475569',
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
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  addButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
});

export default SavedAddressesScreen;
