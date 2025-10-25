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
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="lock-closed-outline" size={20} color="#00A86B" />
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
                    size={24}
                    color={getCardColor(card.type)}
                  />
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{getCardLabel(card.type)}</Text>
                    {card.isActive && (
                      <View style={styles.activeBadge}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
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
                  <Ionicons name="trash-outline" size={20} color="#E53935" />
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
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#00A86B',
    lineHeight: 18,
  },
  cardsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardItemActive: {
    borderColor: '#00A86B',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  cardType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A86B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardNumber: {
    fontSize: 13,
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  cardExpiry: {
    fontSize: 11,
    color: '#777',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default PaymentMethodsScreen;
