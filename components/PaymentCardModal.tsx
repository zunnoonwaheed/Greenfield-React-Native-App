import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../constants/theme';

/**
 * Card details interface
 */
export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface PaymentCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard: (details: CardDetails) => void;
}

const PaymentCardModal: React.FC<PaymentCardModalProps> = ({
  visible,
  onClose,
  onAddCard,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryMonthChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      const month = parseInt(cleaned, 10);
      if (month >= 1 && month <= 12) {
        setExpiryMonth(cleaned);
      } else if (cleaned.length === 1) {
        setExpiryMonth(cleaned);
      }
    }
  };

  const handleExpiryYearChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setExpiryYear(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const handleSave = () => {
    // Validation
    const cardNumberCleaned = cardNumber.replace(/\s/g, '');

    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    if (cardNumberCleaned.length < 15 || cardNumberCleaned.length > 16) {
      Alert.alert('Error', 'Please enter a valid card number (15-16 digits)');
      return;
    }

    if (!expiryMonth || parseInt(expiryMonth, 10) < 1 || parseInt(expiryMonth, 10) > 12) {
      Alert.alert('Error', 'Please enter a valid expiry month (01-12)');
      return;
    }

    if (!expiryYear || expiryYear.length !== 2) {
      Alert.alert('Error', 'Please enter a valid expiry year (YY)');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV (3 digits)');
      return;
    }

    // Call the callback with card details
    onAddCard({
      cardNumber: cardNumberCleaned,
      cardholderName: cardholderName.trim(),
      expiryMonth,
      expiryYear,
      cvv,
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setCardNumber('');
    setCardholderName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Payment Card</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  maxLength={19}
                />
              </View>
            </View>

            {/* Cardholder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cardholder Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Expiry Date and CVV Row */}
            <View style={styles.row}>
              {/* Expiry Month */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Month</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="MM"
                    keyboardType="numeric"
                    value={expiryMonth}
                    onChangeText={handleExpiryMonthChange}
                    maxLength={2}
                  />
                </View>
              </View>

              {/* Expiry Year */}
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Year</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingLeft: Spacing.gap }]}
                    placeholder="YY"
                    keyboardType="numeric"
                    value={expiryYear}
                    onChangeText={handleExpiryYearChange}
                    maxLength={2}
                  />
                </View>
              </View>
            </View>

            {/* CVV */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                  value={cvv}
                  onChangeText={handleCvvChange}
                  maxLength={3}
                />
              </View>
            </View>

            {/* Info Text */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                Your card information is securely encrypted and stored
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Card</Text>
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: Spacing.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  title: {
    fontSize: Typography.heading,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.input,
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.gap,
  },
  inputIcon: {
    marginRight: Spacing.small,
  },
  input: {
    flex: 1,
    height: Layout.inputHeight,
    fontSize: Typography.body,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.gap,
  },
  halfWidth: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '33', // primaryLight with transparency
    padding: Spacing.gap,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.large,
    gap: Spacing.small,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.caption,
    color: Colors.primaryDark,
  },
  buttonContainer: {
    gap: Spacing.gap,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.input,
    alignItems: 'center',
    ...Shadows.button,
  },
  saveButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.white,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundGray,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.input,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
});

export default PaymentCardModal;
