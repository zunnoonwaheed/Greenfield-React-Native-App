/**
 * AddNewAddressScreen - Add a new delivery address
 *
 * Allows users to search for a location, fill in address details,
 * and save a new delivery address
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { addLocation } from '../api/locationAPI';

type AddNewAddressScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type LabelType = 'Home' | 'Office' | 'Other';

const AddNewAddressScreen: React.FC = () => {
  const navigation = useNavigation<AddNewAddressScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [searchLocation, setSearchLocation] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('Home');

  // Address location data (you can extend this with actual map coordinates)
  const [city] = useState('Karachi');
  const [area] = useState('DHA');
  const [sector, setSector] = useState('Phase 2');

  const handleClose = () => {
    navigation.goBack();
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
      // Construct the location data according to the API format
      const locationData = {
        city: city,
        area: area,
        sector: searchLocation.trim() || sector,
        street_number: floor, // Using floor as street number for now
        property_type: selectedLabel === 'Office' ? 'apartment' : 'house',
        house_number: `${buildingName}, Flat ${flat}`,
        // Additional fields not in API but storing in house_number
        // In a production app, you might extend the backend schema
      };

      const response = await addLocation(locationData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Address added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to SavedAddressesScreen
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to add address. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Add New Address</Text>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#94A3B8"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search location"
                placeholderTextColor="#94A3B8"
                value={searchLocation}
                onChangeText={setSearchLocation}
              />
            </View>
          </View>

          {/* Map Preview Placeholder */}
          <View style={styles.mapPreview}>
            <Ionicons name="map" size={48} color="#CBD5E1" />
            <Text style={styles.mapPlaceholderText}>Map Preview</Text>
            <Text style={styles.mapSubtext}>
              {searchLocation || 'Search for a location'}
            </Text>
          </View>

          {/* Address Form */}
          <View style={styles.formSection}>
            {/* Building Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Building name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter building name"
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
              <View style={styles.labelButtons}>
                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Home' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Home')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="home"
                    size={18}
                    color={selectedLabel === 'Home' ? '#FFF' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Home' && styles.labelButtonTextActive,
                    ]}
                  >
                    Home
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Office' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Office')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="briefcase"
                    size={18}
                    color={selectedLabel === 'Office' ? '#FFF' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Office' && styles.labelButtonTextActive,
                    ]}
                  >
                    Office
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Other' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Other')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={18}
                    color={selectedLabel === 'Other' ? '#FFF' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Other' && styles.labelButtonTextActive,
                    ]}
                  >
                    Other
                  </Text>
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
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.addButtonText}>Add Address</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  mapPreview: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 180,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  labelSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  labelButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  labelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  labelButtonActive: {
    backgroundColor: '#026A49',
    borderColor: '#026A49',
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  labelButtonTextActive: {
    color: '#FFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  addButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
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
    color: '#FFF',
  },
});

export default AddNewAddressScreen;
