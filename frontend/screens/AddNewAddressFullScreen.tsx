/**
 * AddNewAddressFullScreen - Full Screen Version
 * Wrapper for AddNewAddressScreen to work as a navigation screen (not modal)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { addAddress } from '../api/addressesAPI';

type LabelType = 'Home' | 'Office' | 'Love' | 'Other';
type NavigationProp = StackNavigationProp<MainStackParamList>;

const AddNewAddressFullScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('islamabad');
  const [buildingName, setBuildingName] = useState('');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('Home');

  const labels: LabelType[] = ['Home', 'Office', 'Love', 'Other'];

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
                // Navigate back to previous screen
                navigation.goBack();
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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
          <Text style={styles.headerTitle}>Add New Address</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Location Field */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Search Location</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../images/homepage-assets/search.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                value={searchLocation}
                onChangeText={setSearchLocation}
                placeholder="Enter city or area"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Label Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Label As</Text>
            <View style={styles.labelContainer}>
              {labels.map((label) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.labelButton,
                    selectedLabel === label && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel(label)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === label && styles.labelButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Address Details */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Address Details</Text>

            <TextInput
              style={styles.textInput}
              value={buildingName}
              onChangeText={setBuildingName}
              placeholder="Building Name *"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.textInput, styles.halfInput]}
                value={flat}
                onChangeText={setFlat}
                placeholder="Flat / Apartment *"
                placeholderTextColor="#94A3B8"
              />
              <TextInput
                style={[styles.textInput, styles.halfInput]}
                value={floor}
                onChangeText={setFloor}
                placeholder="Floor *"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={styles.textInput}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Company Name (Optional)"
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Delivery Instructions (Optional)"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Add Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.addButton, loading && styles.addButtonDisabled]}
            onPress={handleAddAddress}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>Add Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'DM Sans',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#64748B',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  labelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  labelButtonActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  labelButtonTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
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
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default AddNewAddressFullScreen;
