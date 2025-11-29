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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { addPaymentMethod } from '../api/paymentAPI';

type AddPaymentMethodScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface PaymentMethod {
  id: string;
  name: string;
}

const AddPaymentMethodScreen: React.FC = () => {
  const navigation = useNavigation<AddPaymentMethodScreenNavigationProp>();

  const [selectedMethod, setSelectedMethod] = useState<string>('Paypal');
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'paypal', name: 'Paypal' },
    { id: 'visa', name: 'Visa' },
    { id: 'mastercard', name: 'Mastercard' },
    { id: 'amex', name: 'American Express' },
  ];

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
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
    return (
      selectedMethod !== '' &&
      cardHolder.trim() !== '' &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvc.length === 3
    );
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    console.log('💳 Adding payment method...');

    try {
      // Get last 4 digits of card
      const cleanedCardNumber = cardNumber.replace(/\s/g, '');
      const last4 = cleanedCardNumber.slice(-4);

      // Prepare payment data
      const paymentData = {
        method_type: 'card',
        card_last4: last4,
        card_holder: cardHolder.trim(),
        card_brand: selectedMethod.toLowerCase(),
        card_expiry: expiryDate,
        is_default: false,
      };

      console.log('💳 Sending payment data:', paymentData);

      const response = await addPaymentMethod(paymentData);

      if (response.success) {
        console.log('✅ Payment method added successfully');
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
      } else {
        throw new Error(response.error || 'Failed to add payment method');
      }
    } catch (error: any) {
      console.error('❌ Error adding payment method:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to add payment method. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Add Payment Method</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Payment Method Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Payment Method <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowMethodModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>{selectedMethod}</Text>
            <Image
              source={require('../images/homepage-assets/dropdown-pic.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Name on Card */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Name on Card <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Zohaib"
            placeholderTextColor="#999999"
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
          <TextInput
            style={styles.input}
            placeholder="3425 4535 7868 8907"
            placeholderTextColor="#999999"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="number-pad"
            maxLength={19}
          />
        </View>

        {/* Expiry Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Expiry Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="29/29"
            placeholderTextColor="#999999"
            value={expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>

        {/* CVC */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            CVC <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="234"
            placeholderTextColor="#999999"
            value={cvc}
            onChangeText={handleCvcChange}
            keyboardType="number-pad"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save & Add</Text>
        </TouchableOpacity>
      </View>

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
                <Image
                  source={require('../images/homepage-assets/arrow-back.png')}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.methodsList} showsVerticalScrollIndicator={false}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    selectedMethod === method.name && styles.methodItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedMethod(method.name);
                    setShowMethodModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.methodText}>{method.name}</Text>
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
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 120,
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
  required: {
    color: '#E53935',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000000',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: '#000000',
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
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
    maxHeight: '60%',
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
  closeIcon: {
    width: 24,
    height: 24,
  },
  methodsList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  methodItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  methodItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  methodText: {
    fontSize: 15,
    color: '#000000',
  },
});

export default AddPaymentMethodScreen;
