/**
 * EditProfileScreen - Edit User Profile
 * Editable profile photo, name, email, phone
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import * as ImagePicker from 'expo-image-picker';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  // Form state - pre-populated with mock data
  const [fullName, setFullName] = useState('Ahmed Khan');
  const [email, setEmail] = useState('ahmed.khan@example.com');
  const [phone, setPhone] = useState('3001234567');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: '+92',
    country: 'Pakistan',
    flag: '🇵🇰',
  });

  const countryCodes: CountryCode[] = [
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  ];

  const handlePickPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to change your profile photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const isFormValid = () => {
    return (
      fullName.trim() !== '' &&
      email.trim() !== '' &&
      phone.trim() !== '' &&
      email.includes('@')
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Input', 'Please fill in all fields correctly.');
      return;
    }

    // TODO: API call to update profile
    Alert.alert(
      'Success',
      'Your profile has been updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleSelectCountry = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <Image
                source={require('../images/homepage-assets/home-shop-category.png')}
                style={styles.profilePhoto}
              />
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handlePickPhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoLabel}>Profile Photo</Text>
          <Text style={styles.photoHint}>Tap to change</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Number with Country Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setShowCountryModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Ionicons name="chevron-down" size={16} color="#777" />
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                placeholder="3001234567"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!isFormValid()}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Code Selector Modal */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity
                onPress={() => setShowCountryModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.countryList} showsVerticalScrollIndicator={false}>
              {countryCodes.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryItem,
                    selectedCountry.code === country.code && styles.countryItemSelected,
                  ]}
                  onPress={() => handleSelectCountry(country)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryItemFlag}>{country.flag}</Text>
                  <Text style={styles.countryItemName}>{country.country}</Text>
                  <Text style={styles.countryItemCode}>{country.code}</Text>
                  {selectedCountry.code === country.code && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5E5',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A86B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  photoHint: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    paddingHorizontal: 20,
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
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  countryList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  countryItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  countryItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryItemName: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  countryItemCode: {
    fontSize: 14,
    color: '#777',
    marginRight: 12,
  },
});

export default EditProfileScreen;
