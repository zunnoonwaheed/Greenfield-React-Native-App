import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard: (cardDetails: CardDetails) => void;
}

export interface CardDetails {
  paymentMethod: string;
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

interface PaymentOption {
  id: string;
  label: string;
  icon: string;
}

const paymentOptions: PaymentOption[] = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google', label: 'Google Pay', icon: 'logo-google' },
  { id: 'cash', label: 'Cash on Delivery', icon: 'cash' },
];

const PaymentCardModal: React.FC<PaymentCardModalProps> = ({
  visible,
  onClose,
  onAddCard,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const selectedOption = paymentOptions.find(opt => opt.id === paymentMethod);

  const handleAddCard = () => {
    // Validate all fields
    const newErrors: {[key: string]: string} = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (paymentMethod === 'card') {
      if (!nameOnCard.trim()) {
        newErrors.nameOnCard = 'Name on card is required';
      }
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      if (!expiryDate.trim() || expiryDate.length < 5) {
        newErrors.expiryDate = 'Valid expiry date is required';
      }
      if (!cvc.trim() || cvc.length < 3) {
        newErrors.cvc = 'Valid CVC is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        paymentMethod: true,
        nameOnCard: true,
        cardNumber: true,
        expiryDate: true,
        cvc: true,
      });
      return;
    }

    const cardDetails: CardDetails = {
      paymentMethod: selectedOption?.label || paymentMethod,
      nameOnCard,
      cardNumber,
      expiryDate,
      cvc,
    };
    onAddCard(cardDetails);

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setPaymentMethod('');
    setNameOnCard('');
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setErrors({});
    setTouched({});
    setShowDropdown(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectPaymentMethod = (optionId: string) => {
    setPaymentMethod(optionId);
    setShowDropdown(false);
    setErrors({ ...errors, paymentMethod: '' });
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Enter Card Details</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#424242" />
                  </TouchableOpacity>
                </View>

                {/* Payment Method Dropdown */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Payment Method <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdownContainer,
                      touched.paymentMethod && errors.paymentMethod && styles.inputError
                    ]}
                    onPress={() => setShowDropdown(!showDropdown)}
                    activeOpacity={0.7}
                  >
                    {selectedOption ? (
                      <View style={styles.selectedOption}>
                        <Ionicons name={selectedOption.icon as any} size={20} color="#2E7D32" />
                        <Text style={styles.dropdownText}>{selectedOption.label}</Text>
                      </View>
                    ) : (
                      <Text style={styles.placeholderText}>Select a payment method</Text>
                    )}
                    <Ionicons
                      name={showDropdown ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#757575"
                    />
                  </TouchableOpacity>
                  {touched.paymentMethod && errors.paymentMethod && (
                    <Text style={styles.errorText}>{errors.paymentMethod}</Text>
                  )}

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <View style={styles.dropdownMenu}>
                      {paymentOptions.map((option) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.dropdownOption,
                            paymentMethod === option.id && styles.dropdownOptionSelected
                          ]}
                          onPress={() => selectPaymentMethod(option.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={option.icon as any}
                            size={20}
                            color={paymentMethod === option.id ? "#2E7D32" : "#757575"}
                          />
                          <Text style={[
                            styles.dropdownOptionText,
                            paymentMethod === option.id && styles.dropdownOptionTextSelected
                          ]}>
                            {option.label}
                          </Text>
                          {paymentMethod === option.id && (
                            <Ionicons name="checkmark" size={20} color="#2E7D32" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Show card fields only if Credit/Debit Card is selected */}
                {paymentMethod === 'card' && (
                  <>
                    {/* Name on Card */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Name on Card <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          touched.nameOnCard && errors.nameOnCard && styles.inputError
                        ]}
                        placeholder="Enter name"
                        placeholderTextColor="#9E9E9E"
                        value={nameOnCard}
                        onChangeText={(text) => {
                          setNameOnCard(text);
                          setErrors({ ...errors, nameOnCard: '' });
                        }}
                        onBlur={() => handleBlur('nameOnCard')}
                      />
                      {touched.nameOnCard && errors.nameOnCard && (
                        <Text style={styles.errorText}>{errors.nameOnCard}</Text>
                      )}
                    </View>

                    {/* Card Number */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Card Number <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          touched.cardNumber && errors.cardNumber && styles.inputError
                        ]}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#9E9E9E"
                        value={cardNumber}
                        onChangeText={(text) => {
                          setCardNumber(formatCardNumber(text));
                          setErrors({ ...errors, cardNumber: '' });
                        }}
                        onBlur={() => handleBlur('cardNumber')}
                        keyboardType="numeric"
                        maxLength={19}
                      />
                      {touched.cardNumber && errors.cardNumber && (
                        <Text style={styles.errorText}>{errors.cardNumber}</Text>
                      )}
                    </View>

                    {/* Expiry and CVC */}
                    <View style={styles.rowInputs}>
                      <View style={[styles.inputGroup, styles.halfWidth]}>
                        <Text style={styles.label}>
                          Expiry Date <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            touched.expiryDate && errors.expiryDate && styles.inputError
                          ]}
                          placeholder="MM/YY"
                          placeholderTextColor="#9E9E9E"
                          value={expiryDate}
                          onChangeText={(text) => {
                            setExpiryDate(formatExpiryDate(text));
                            setErrors({ ...errors, expiryDate: '' });
                          }}
                          onBlur={() => handleBlur('expiryDate')}
                          keyboardType="numeric"
                          maxLength={5}
                        />
                        {touched.expiryDate && errors.expiryDate && (
                          <Text style={styles.errorText}>{errors.expiryDate}</Text>
                        )}
                      </View>

                      <View style={[styles.inputGroup, styles.halfWidth]}>
                        <Text style={styles.label}>
                          CVC <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            touched.cvc && errors.cvc && styles.inputError
                          ]}
                          placeholder="123"
                          placeholderTextColor="#9E9E9E"
                          value={cvc}
                          onChangeText={(text) => {
                            setCvc(text);
                            setErrors({ ...errors, cvc: '' });
                          }}
                          onBlur={() => handleBlur('cvc')}
                          keyboardType="numeric"
                          maxLength={3}
                          secureTextEntry={true}
                        />
                        {touched.cvc && errors.cvc && (
                          <Text style={styles.errorText}>{errors.cvc}</Text>
                        )}
                      </View>
                    </View>
                  </>
                )}

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={handleAddCard}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addCardButtonText}>
                      {paymentMethod === 'card' ? 'Add Card' : 'Continue'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  required: {
    color: '#FF3B30',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    fontFamily: 'Poppins',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontFamily: 'Poppins',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E8F5E9',
  },
  dropdownOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    fontFamily: 'Poppins',
  },
  dropdownOptionTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  addCardButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addCardButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#424242',
    fontFamily: 'Poppins',
  },
});

export default PaymentCardModal;
