/**
 * SavedAddressesScreen - Modal Component
 * Shows list of saved addresses as an overlay on homepage
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SavedAddress {
  id: string;
  name: string;
  address: string;
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
  const addresses: SavedAddress[] = [
    {
      id: '1',
      name: 'Sky Avenue',
      address: 'House 45, St. 12, Block V, Gulshan...',
    },
    {
      id: '2',
      name: 'Maple Street',
      address: 'Apartment 3B, Lane 7, Sector 10,...',
    },
    {
      id: '3',
      name: 'Ocean Drive',
      address: 'Villa 22, Beach Road, Coastal Are...',
    },
    {
      id: '4',
      name: 'Pine Hill',
      address: 'Cottage 8, Pine Lane, Green Valle...',
    },
  ];

  const handleSelectAddress = (address: SavedAddress) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
    onClose();
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
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={styles.addressCard}
                onPress={() => handleSelectAddress(address)}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../images/homepage-assets/map-pin.png')}
                  style={styles.locationIcon}
                  resizeMode="contain"
                />
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {address.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  addressList: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#059669',
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontFamily: 'DM Sans',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  addNewButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
});

export default SavedAddressesScreen;