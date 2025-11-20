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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateAd } from './CreateAdContext';

interface CreateAdStep3Props {
  onPublish: () => void;
  onBack: () => void;
  showDifferentInfo: boolean;
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

const CreateAdStep3: React.FC<CreateAdStep3Props> = ({ onPublish, onBack, showDifferentInfo }) => {
  const { adData, updateAdData, resetAdData } = useCreateAd();
  const [showCityModal, setShowCityModal] = useState(false);

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
        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../images/homepage-assets/profile-icon.png')}
              style={styles.inputIconInside}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={adData.fullName}
              onChangeText={(text) => updateAdData({ fullName: text })}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../images/homepage-assets/phone.png')}
              style={styles.inputIconInside}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 03001234567"
              placeholderTextColor="#94A3B8"
              value={adData.phone}
              onChangeText={(text) => updateAdData({ phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../images/homepage-assets/mailbox.png')}
              style={styles.inputIconInside}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="your.email@example.com"
              placeholderTextColor="#94A3B8"
              value={adData.email}
              onChangeText={(text) => updateAdData({ email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* City */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCityModal(true)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/homepage-assets/map-location.png')}
              style={styles.inputIconInside}
              resizeMode="contain"
            />
            <Text
              style={[
                adData.city ? styles.dropdownText : styles.dropdownPlaceholder,
              ]}
            >
              {adData.city || 'Select your city'}
            </Text>
            <Image
              source={require('../images/homepage-assets/dropdown-pic.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Complete Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Complete Address</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <Image
              source={require('../images/homepage-assets/pin-add.png')}
              style={[styles.inputIconInside, styles.textAreaIcon]}
              resizeMode="contain"
            />
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="House #, Street, Area"
              placeholderTextColor="#94A3B8"
              value={adData.address}
              onChangeText={(text) => updateAdData({ address: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Info Box - Shows when different info toggle is active */}
        {showDifferentInfo && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#059669" />
            <Text style={styles.infoText}>
              You can enter different contact details above if you want buyers to reach you at a different number or email for this specific ad.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
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
                    <Ionicons name="checkmark" size={20} color="#059669" />
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIconInside: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: '#64748B',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
    fontFamily: 'DM Sans',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  dropdownButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'DM Sans',
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: '#64748B',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#059669',
    lineHeight: 18,
    fontFamily: 'DM Sans',
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
  publishButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: '#BBF7D0',
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  publishButtonTextDisabled: {
    color: '#FFFFFF',
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
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  modalItemText: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
});

export default CreateAdStep3;
