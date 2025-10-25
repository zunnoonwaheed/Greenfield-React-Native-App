/**
 * AddPaymentMethodScreen - Add New Payment Method
 * Form to add credit/debit card or PayPal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type AddPaymentMethodScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface PaymentMethod {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const AddPaymentMethodScreen: React.FC = () => {
  const navigation = useNavigation<AddPaymentMethodScreenNavigationProp>();

  const [selectedMethod, setSelectedMethod] = useState<string>('visa');
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { id: 'visa', name: 'Visa', icon: 'card-outline' },
    { id: 'mastercard', name: 'Mastercard', icon: 'card-outline' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
  ];

  const formatCardNumber = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const handleCvcChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setCvc(cleaned.substring(0, 3));
  };

  const isFormValid = () => {
    if (selectedMethod === 'paypal') {
      return cardHolder.trim() !== '' && cardHolder.includes('@');
    }
    return (
      cardHolder.trim() !== '' &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvc.length === 3
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields correctly.');
      return;
    }

    // TODO: API call to save payment method
    Alert.alert(
      'Payment Method Added',
      'Your payment method has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const getMethodName = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    return method ? method.name : '';
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
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={48} color="#00A86B" />
          <Text style={styles.infoTitle}>Secure Payment</Text>
          <Text style={styles.infoText}>
            Your card details are encrypted with industry-standard security
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Payment Method Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Payment Method <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowMethodModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownContent}>
                <Ionicons
                  name={
                    paymentMethods.find((m) => m.id === selectedMethod)?.icon ||
                    'card-outline'
                  }
                  size={20}
                  color="#00A86B"
                />
                <Text style={styles.dropdownText}>{getMethodName()}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#777" />
            </TouchableOpacity>
          </View>

          {selectedMethod === 'paypal' ? (
            // PayPal Email Field
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                PayPal Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#999"
                value={cardHolder}
                onChangeText={setCardHolder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <>
              {/* Card Holder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Name on Card <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ahmed Khan"
                  placeholderTextColor="#999"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  autoCapitalize="words"
                />
              </View>

              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Card Number <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.cardNumberContainer}>
                  <TextInput
                    style={styles.cardNumberInput}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#999"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="number-pad"
                    maxLength={19}
                  />
                  <Ionicons name="card-outline" size={20} color="#777" />
                </View>
              </View>

              {/* Expiry Date and CVC */}
              <View style={styles.rowInputGroup}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>
                    Expiry Date <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>
                    CVC <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#999"
                    value={cvc}
                    onChangeText={handleCvcChange}
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </>
          )}

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Ionicons name="lock-closed" size={16} color="#00A86B" />
            <Text style={styles.securityNoticeText}>
              Your payment information is never stored on our servers
            </Text>
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
            <Text style={styles.saveButtonText}>Save & Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showMethodModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMethodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity
                onPress={() => setShowMethodModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <View style={styles.methodsList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    selectedMethod === method.id && styles.methodItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedMethod(method.id);
                    setShowMethodModal(false);
                    // Reset form when changing method
                    setCardHolder('');
                    setCardNumber('');
                    setExpiryDate('');
                    setCvc('');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={method.icon} size={24} color="#00A86B" />
                  <Text style={styles.methodText}>{method.name}</Text>
                  {selectedMethod === method.id && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  infoText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
  required: {
    color: '#E53935',
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
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000000',
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardNumberInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  rowInputGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  securityNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#00A86B',
    lineHeight: 16,
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
  methodsList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  methodItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  methodText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
});

export default AddPaymentMethodScreen;
