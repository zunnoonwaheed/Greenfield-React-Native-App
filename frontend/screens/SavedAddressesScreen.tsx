/**
 * SavedAddressesScreen - Modal Component
 * Shows list of saved addresses as an overlay on homepage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAddresses, setDefaultAddress } from '../api/addressesAPI';

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  label?: string;
  is_default?: number;
}

interface SavedAddressesScreenProps {
  visible: boolean;
  onClose: () => void;
  onAddNewAddress: () => void;
  onSelectAddress?: (address: SavedAddress) => void;
}

const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
  visible,
  onClose,
  onAddNewAddress,
  onSelectAddress
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (visible) {
      fetchAddresses();
    }
  }, [visible]);

  const fetchAddresses = async () => {
    setFetchingAddresses(true);
    try {
      const response = await getAddresses();
      if (response.success && response.data?.addresses) {
        setAddresses(response.data.addresses);
        console.log('✅ Loaded', response.data.addresses.length, 'addresses');
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const handleSelectAddress = async (address: SavedAddress) => {
    setLoading(true);
    setSelectedId(address.id);

    try {
      console.log('📍 Selecting address:', address.name);

      // Set as default address in backend
      const response = await setDefaultAddress(address.id);

      if (response.success) {
        console.log('✅ Address set as default');
        if (onSelectAddress) {
          onSelectAddress(address);
        }
        onClose();
      } else {
        Alert.alert('Error', 'Failed to update address');
      }
    } catch (error: any) {
      console.error('❌ Error selecting address:', error);
      Alert.alert('Error', error.message || 'Failed to update address');
    } finally {
      setLoading(false);
      setSelectedId(null);
    }
  };

  const handleAddNewAddress = () => {
    console.log('Add New Address button pressed in SavedAddressesScreen');
    if (onAddNewAddress) {
      console.log('Calling onAddNewAddress callback');
      onAddNewAddress();
    } else {
      console.log('ERROR: onAddNewAddress is undefined!');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Saved Addresses</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Address List */}
          <ScrollView
            style={styles.addressList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {fetchingAddresses ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.loadingText}>Loading addresses...</Text>
              </View>
            ) : addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptyText}>Add your first delivery address</Text>
              </View>
            ) : (
              addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressCard,
                    selectedId === address.id && styles.addressCardSelected
                  ]}
                  onPress={() => handleSelectAddress(address)}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  {loading && selectedId === address.id ? (
                    <ActivityIndicator size="small" color="#059669" style={styles.loadingIcon} />
                  ) : (
                    <Image
                      source={require('../images/homepage-assets/map-pin.png')}
                      style={styles.locationIcon}
                      resizeMode="contain"
                    />
                  )}
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {address.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addNewButton}
              onPress={handleAddNewAddress}
              activeOpacity={0.8}
            >
              <Text style={styles.addNewButtonText}>Add New Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 380,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  addressList: {
    maxHeight: 320,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    fontFamily: 'DM Sans',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'DM Sans',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  addressCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  addressCardDefault: {
    borderColor: '#059669',
  },
  locationIcon: {
    width: 22,
    height: 22,
    tintColor: '#059669',
    marginRight: 12,
  },
  loadingIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontFamily: 'DM Sans',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
  },
  addNewButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
});

export default SavedAddressesScreen;