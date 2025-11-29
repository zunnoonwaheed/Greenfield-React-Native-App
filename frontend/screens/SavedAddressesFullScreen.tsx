/**
 * SavedAddressesFullScreen - Full Screen Version
 * Wrapper for SavedAddressesScreen to work as a navigation screen (not modal)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { getAddresses, setDefaultAddress } from '../api/addressesAPI';

type SavedAddressesFullScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  label?: string;
  is_default?: number;
}

const SavedAddressesFullScreen: React.FC = () => {
  const navigation = useNavigation<SavedAddressesFullScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  // Fetch addresses when screen loads
  React.useEffect(() => {
    fetchAddresses();
  }, []);

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
      console.log('📍 Setting default address:', address.name);
      const response = await setDefaultAddress(address.id);

      if (response.success) {
        console.log('✅ Address set as default');
        // Refresh list
        await fetchAddresses();
      }
    } catch (error: any) {
      console.error('❌ Error setting default address:', error);
    } finally {
      setLoading(false);
      setSelectedId(null);
    }
  };

  const handleAddNewAddress = () => {
    console.log('🆕 Navigating to AddNewAddress');
    navigation.navigate('AddNewAddress' as any);
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
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Address List */}
      <ScrollView
        style={styles.content}
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
            <Image
              source={require('../images/homepage-assets/saved-address.png')}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyText}>Add your first delivery address</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                address.is_default === 1 && styles.addressCardDefault,
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
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{address.label || 'Address'}</Text>
                  {address.is_default === 1 && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address.address}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add New Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  addressCardDefault: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  addressCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  locationIcon: {
    width: 24,
    height: 24,
    tintColor: '#059669',
    marginRight: 12,
  },
  loadingIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'DM Sans',
  },
  defaultBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontFamily: 'DM Sans',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default SavedAddressesFullScreen;
