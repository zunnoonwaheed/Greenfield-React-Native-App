/**
 * EditProfileScreen - Edit User Profile - Dynamic Backend Save
 * Editable profile photo, name, email, phone
 */

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import * as ImagePicker from 'expo-image-picker';
import { getProfile, updateProfile } from '../api/userAPI';
import { useAuth } from '../contexts/AuthContext';

type EditProfileScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user: authUser, setUser } = useAuth();

  // Form state - will be loaded from backend
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: 'PK +92',
    country: 'Pakistan',
    flag: '🇵🇰',
  });

  // Load user data from backend on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const result = await getProfile();
      if (result.success && result.data?.user) {
        const user = result.data.user;
        setFullName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const countryCodes: CountryCode[] = [
    { code: 'US +01', country: 'United States', flag: '🇺🇸' },
    { code: 'PK +92', country: 'Pakistan', flag: '🇵🇰' },
    { code: 'UK +44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: 'UAE +971', country: 'UAE', flag: '🇦🇪' },
    { code: 'SA +966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'IN +91', country: 'India', flag: '🇮🇳' },
    { code: 'MY +60', country: 'Malaysia', flag: '🇲🇾' },
    { code: 'SG +65', country: 'Singapore', flag: '🇸🇬' },
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

  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Input', 'Please fill in all fields correctly.');
      return;
    }

    setSaving(true);
    try {
      // Call backend API to update profile
      const result = await updateProfile({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (result.success) {
        // Update AuthContext with new user data
        if (setUser && result.data?.user) {
          setUser(result.data.user);
        }

        Alert.alert(
          'Success',
          'Your profile has been updated successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
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
          <Image
            source={require('../images/homepage-assets/arrow-back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.8}>
            <View style={styles.photoContainer}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
              ) : (
                <Image
                  source={require('../images/homepage-assets/profile-pic.png')}
                  style={styles.profilePhoto}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../images/homepage-assets/profile-icon.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.input}
              placeholder="Jane Doe"
              placeholderTextColor="#999999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../images/homepage-assets/messege-box.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.input}
              placeholder="Porter67@gmail.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Phone Number with Country Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.phoneInputWrapper}>
              <Image
                source={require('../images/homepage-assets/phone.png')}
                style={styles.phoneIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.phoneInputMain}
                placeholder="329 393 3230"
                placeholderTextColor="#999999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity
              style={styles.countryCodeBox}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
              <Image
                source={require('../images/homepage-assets/dropdown-pic.png')}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  inputIconLeft: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  phoneIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  phoneIconLeft: {
    marginRight: 12,
  },
  phoneInputMain: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  saveButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
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
    borderBottomColor: '#F3F4F6',
  },
  countryItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  countryItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryItemName: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  countryItemCode: {
    fontSize: 15,
    color: '#6C757D',
    marginRight: 12,
  },
});

export default EditProfileScreen;
