/**
 * PaymentMethodsScreen - Saved Payment Methods
 * View and manage saved credit/debit cards
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal';
  cardNumber: string; // Last 4 digits
  cardHolder: string;
  expiryDate: string;
  isActive: boolean;
}

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();

  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      cardNumber: '4532',
      cardHolder: 'Ahmed Khan',
      expiryDate: '12/25',
      isActive: true,
    },
    {
      id: '2',
      type: 'mastercard',
      cardNumber: '8901',
      cardHolder: 'Ahmed Khan',
      expiryDate: '08/26',
      isActive: false,
    },
    {
      id: '3',
      type: 'paypal',
      cardNumber: '6789',
      cardHolder: 'ahmed.khan@example.com',
      expiryDate: 'N/A',
      isActive: false,
    },
  ]);

  const handleSetActive = (id: string) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isActive: card.id === id,
      }))
    );
    Alert.alert('Payment Method Updated', 'This card is now your default payment method.');
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCards((prev) => prev.filter((card) => card.id !== id));
          },
        },
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return 'card-outline';
      case 'mastercard':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      default:
        return 'card-outline';
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa':
        return '#1A1F71';
      case 'mastercard':
        return '#EB001B';
      case 'paypal':
        return '#003087';
      default:
        return '#000000';
    }
  };

  const getCardLabel = (type: string) => {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Card';
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
          <Ionicons name="arrow-back" size={Layout.iconSize} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: Layout.iconSize }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.success} />
          <Text style={styles.infoBannerText}>
            Your payment information is encrypted and secure
          </Text>
        </View>

        {/* Saved Cards */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>

          {cards.map((card) => (
            <View
              key={card.id}
              style={[
                styles.cardItem,
                card.isActive && styles.cardItemActive,
              ]}
            >
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => handleSetActive(card.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.cardIconContainer,
                    { backgroundColor: `${getCardColor(card.type)}15` },
                  ]}
                >
                  <Ionicons
                    name={getCardIcon(card.type)}
                    size={Layout.iconSize}
                    color={getCardColor(card.type)}
                  />
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{getCardLabel(card.type)}</Text>
                    {card.isActive && (
                      <View style={styles.activeBadge}>
                        <Ionicons name="checkmark" size={Typography.caption} color={Colors.white} />
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardNumber}>
                    {card.type === 'paypal' ? card.cardHolder : `•••• •••• •••• ${card.cardNumber}`}
                  </Text>
                  <Text style={styles.cardExpiry}>
                    {card.type === 'paypal' ? 'Linked Account' : `Expires ${card.expiryDate}`}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteCard(card.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Payment Method Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPaymentMethod')}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
    color: Colors.black,
    fontFamily: 'Poppins',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.screenPadding,
    marginBottom: Spacing.medium,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    gap: Spacing.gap,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.success,
    lineHeight: 18,
  },
  cardsContainer: {
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.black,
    marginBottom: Spacing.medium,
    fontFamily: 'Poppins',
  },
  cardItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.gap,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.transparent,
  },
  cardItemActive: {
    borderColor: Colors.success,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.medium,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.gap,
  },
  cardDetails: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.small,
  },
  cardType: {
    fontSize: 15,
    fontWeight: Typography.semibold,
    color: Colors.black,
    fontFamily: 'Poppins',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.small,
    paddingVertical: 3,
    borderRadius: BorderRadius.medium,
    gap: Spacing.xs,
  },
  activeBadgeText: {
    fontSize: Typography.tiny,
    fontWeight: Typography.semibold,
    color: Colors.white,
  },
  cardNumber: {
    fontSize: 13,
    color: Colors.black,
    marginBottom: Spacing.xs,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.small,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.white,
    fontFamily: 'Poppins',
  },
});

export default PaymentMethodsScreen;
