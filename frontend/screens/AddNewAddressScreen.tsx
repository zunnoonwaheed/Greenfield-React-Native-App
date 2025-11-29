/**
 * AddNewAddressScreen - Modal Component
 * Form to add a new delivery address as an overlay
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addAddress } from '../api/addressesAPI';

type LabelType = 'Home' | 'Office' | 'Love' | 'Other';

interface AddNewAddressScreenProps {
  visible: boolean;
  onClose: () => void;
  onAddressAdded?: () => void;
}

const AddNewAddressScreen: React.FC<AddNewAddressScreenProps> = ({
  visible,
  onClose,
  onAddressAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('Home');

  const handleClose = () => {
    // Reset form
    setSearchLocation('');
    setBuildingName('');
    setFlat('');
    setFloor('');
    setCompanyName('');
    setInstructions('');
    setSelectedLabel('Home');
    onClose();
  };

  const validateForm = (): boolean => {
    if (!buildingName.trim()) {
      Alert.alert('Validation Error', 'Please enter a building name');
      return false;
    }
    if (!flat.trim()) {
      Alert.alert('Validation Error', 'Please enter a flat/apartment number');
      return false;
    }
    if (!floor.trim()) {
      Alert.alert('Validation Error', 'Please enter a floor number');
      return false;
    }
    return true;
  };

  const handleAddAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Build the complete address string for display
      const fullAddress = [
        flat && `Flat ${flat}`,
        floor && `Floor ${floor}`,
        companyName && companyName,
        searchLocation && searchLocation,
      ]
        .filter(Boolean)
        .join(', ');

      console.log('💾 Saving address to user_addresses table:', buildingName, fullAddress);

      // Call backend API to add new address to user_addresses table
      const response = await addAddress({
        label: selectedLabel,
        name: buildingName,
        address: fullAddress,
        building_name: buildingName,
        flat: flat,
        floor: floor,
        company_name: companyName,
        instructions: instructions,
        is_default: true, // Make new address default
      });

      if (response.success) {
        console.log('✅ Address saved successfully');
        Alert.alert(
          'Success',
          'Address added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onAddressAdded) {
                  onAddressAdded();
                }
                handleClose();
              },
            },
          ]
        );
      } else {
        throw new Error(response.error || 'Failed to save address');
      }
    } catch (error: any) {
      console.error('❌ Error saving address:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save address. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add New Address</Text>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
              >
              {/* Search Location */}
              <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                  <Image
                    source={require('../images/homepage-assets/search_9109565 1.png')}
                    style={styles.searchIcon}
                    resizeMode="contain"
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search location"
                    placeholderTextColor="#9CA3AF"
                    value={searchLocation}
                    onChangeText={setSearchLocation}
                  />
                </View>
              </View>

              {/* Map Preview */}
              <View style={styles.mapPreview}>
                <Image
                  source={require('../images/homepage-assets/map-banner.png')}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
              </View>

              {/* Address Form */}
              <View style={styles.formSection}>
                {/* Building Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Building name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter building name"
                    placeholderTextColor="#9CA3AF"
                    value={buildingName}
                    onChangeText={setBuildingName}
                  />
                </View>

                {/* Flat */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Flat</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter flat number"
                    placeholderTextColor="#9CA3AF"
                    value={flat}
                    onChangeText={setFlat}
                  />
                </View>

                {/* Floor */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Floor</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter floor number"
                    placeholderTextColor="#9CA3AF"
                    value={floor}
                    onChangeText={setFloor}
                    keyboardType="numeric"
                  />
                </View>

                {/* Company Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter company name (optional)"
                    placeholderTextColor="#9CA3AF"
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>

                {/* Instructions for Driver */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Instructions for driver</Text>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Add any special instructions"
                    placeholderTextColor="#9CA3AF"
                    value={instructions}
                    onChangeText={setInstructions}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Add Label Section */}
                <View style={styles.labelSection}>
                  <Text style={styles.label}>Add Label</Text>
                  <View style={styles.labelButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.labelButton,
                        selectedLabel === 'Home' && styles.labelButtonActive
                      ]}
                      onPress={() => setSelectedLabel('Home')}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.labelIconBox, selectedLabel === 'Home' && styles.labelIconBoxActive]}>
                        <Ionicons name="home" size={18} color="#059669" />
                      </View>
                      <Text style={styles.labelButtonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.labelButton,
                        selectedLabel === 'Office' && styles.labelButtonActive
                      ]}
                      onPress={() => setSelectedLabel('Office')}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.labelIconBox, selectedLabel === 'Office' && styles.labelIconBoxActive]}>
                        <Ionicons name="business" size={18} color="#059669" />
                      </View>
                      <Text style={styles.labelButtonText}>Office</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.labelButton,
                        selectedLabel === 'Love' && styles.labelButtonActive
                      ]}
                      onPress={() => setSelectedLabel('Love')}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.labelIconBox, selectedLabel === 'Love' && styles.labelIconBoxActive]}>
                        <Ionicons name="heart" size={18} color="#059669" />
                      </View>
                      <Text style={styles.labelButtonText}>Love</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.labelButton,
                        selectedLabel === 'Other' && styles.labelButtonActive
                      ]}
                      onPress={() => setSelectedLabel('Other')}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.labelIconBox, selectedLabel === 'Other' && styles.labelIconBoxActive]}>
                        <Ionicons name="chatbox" size={18} color="#059669" />
                      </View>
                      <Text style={styles.labelButtonText}>Other</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Add Address Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.addButton, loading && styles.addButtonDisabled]}
                  onPress={handleAddAddress}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.addButtonText}>Add Address</Text>
                  )}
                </TouchableOpacity>
              </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker since it's a second layer
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 430, // Match Figma width
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 430, // Match Figma width
    height: '88%', // Slightly taller to fit all content comfortably
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
    padding: 0,
  },
  mapPreview: {
    marginHorizontal: 20,
    marginBottom: 16,
    height: 140,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'DM Sans',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  multilineInput: {
    minHeight: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  labelSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  labelButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  labelButton: {
    alignItems: 'center',
    gap: 6,
  },
  labelButtonActive: {
    opacity: 1,
  },
  labelIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  labelIconBoxActive: {
    borderColor: '#059669',
    backgroundColor: '#DCFCE7',
  },
  labelButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    fontFamily: 'DM Sans',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  addButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default AddNewAddressScreen;