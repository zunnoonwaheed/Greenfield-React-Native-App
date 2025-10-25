/**
 * CreateAdStep3 - Contact & Location
 * Seller contact details and location information
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
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateAd } from './CreateAdContext';

interface CreateAdStep3Props {
  onPublish: () => void;
  onBack: () => void;
}

// Mock cities data
const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
];

const CreateAdStep3: React.FC<CreateAdStep3Props> = ({ onPublish, onBack }) => {
  const { adData, updateAdData, resetAdData } = useCreateAd();
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDifferentInfo, setShowDifferentInfo] = useState(false);

  const isFormValid = () => {
    return (
      adData.fullName.trim() !== '' &&
      adData.phone.trim() !== '' &&
      adData.email.trim() !== '' &&
      adData.city !== '' &&
      adData.address.trim() !== ''
    );
  };

  const handleCitySelect = (city: string) => {
    updateAdData({ city });
    setShowCityModal(false);
  };

  const handlePublish = () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Success! 🎉',
      'Your ad has been published successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            resetAdData();
            onPublish();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Collect seller details and make ad discoverable.
        </Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Full Name</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full name"
            placeholderTextColor="#9E9E9E"
            value={adData.fullName}
            onChangeText={(text) => updateAdData({ fullName: text })}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Phone Number</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 03001234567"
            placeholderTextColor="#9E9E9E"
            value={adData.phone}
            onChangeText={(text) => updateAdData({ phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Email</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="your.email@example.com"
            placeholderTextColor="#9E9E9E"
            value={adData.email}
            onChangeText={(text) => updateAdData({ email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* City */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>City</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCityModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                adData.city ? styles.dropdownText : styles.dropdownPlaceholder,
              ]}
            >
              {adData.city || 'Select your city'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Complete Address */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="home-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Complete Address</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="House #, Street, Area"
            placeholderTextColor="#9E9E9E"
            value={adData.address}
            onChangeText={(text) => updateAdData({ address: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Add Different Info Toggle */}
        <TouchableOpacity
          style={styles.differentInfoButton}
          onPress={() => setShowDifferentInfo(!showDifferentInfo)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showDifferentInfo ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={showDifferentInfo ? '#00A86B' : '#9E9E9E'}
          />
          <Text style={styles.differentInfoText}>
            Use different contact information for this ad
          </Text>
        </TouchableOpacity>

        {showDifferentInfo && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#00A86B" />
            <Text style={styles.infoText}>
              You can enter different contact details above if you want buyers to reach you at a different number or email for this specific ad.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.publishButton, !isFormValid() && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={!isFormValid()}
            activeOpacity={0.8}
          >
            <Text style={[styles.publishButtonText, !isFormValid() && styles.publishButtonTextDisabled]}>
              Post Ad
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* City Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCitySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {adData.city === item && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  differentInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    marginBottom: 12,
  },
  differentInfoText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 18,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00A86B',
    fontFamily: 'Poppins',
  },
  publishButton: {
    flex: 1,
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
  publishButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  publishButtonTextDisabled: {
    color: '#9E9E9E',
  },
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
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: {
    fontSize: 14,
    color: '#000',
  },
});

export default CreateAdStep3;
