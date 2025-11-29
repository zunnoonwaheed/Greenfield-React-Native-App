/**
 * PaymentMethodsScreen - Saved Payment Methods
 * View and manage saved credit/debit cards - Dynamic from Backend
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '../api/paymentAPI';
import { Alert } from 'react-native';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface PaymentCard {
  id: string;
  type: string;
  cardNumber: string; // Last 4 digits
  expiryDate: string;
  isDefault: boolean;
  icon: any;
}

// Card brand to icon mapping
const CARD_ICONS: { [key: string]: any } = {
  amex: require('../images/homepage-assets/card1.png'),
  visa: require('../images/homepage-assets/card2.png'),
  mastercard: require('../images/homepage-assets/card2.png'),
  default: require('../images/homepage-assets/card2.png'),
};

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch payment methods from backend
  const fetchPaymentMethods = async () => {
    try {
      console.log('💳 Fetching payment methods...');
      const result = await getPaymentMethods();
      console.log('💳 Payment methods response:', JSON.stringify(result, null, 2));

      if (result.success && result.data?.payment_methods) {
        console.log('💳 Payment methods count:', result.data.payment_methods.length);
        // Transform backend data to match frontend interface
        const transformedCards: PaymentCard[] = result.data.payment_methods.map((method: any) => ({
          id: String(method.id),
          type: method.card_brand || method.type || 'card',
          cardNumber: method.card_last4 || '****',
          expiryDate: method.card_expiry || 'N/A',
          isDefault: method.is_default === true || method.is_default === 1,
          icon: CARD_ICONS[method.card_brand?.toLowerCase()] || CARD_ICONS.default,
        }));
        setCards(transformedCards);
        console.log('💳 Transformed cards:', transformedCards.length);
      } else {
        console.log('💳 No payment methods found or invalid response');
        setCards([]);
      }
    } catch (error) {
      console.error('💳 Error fetching payment methods:', error);
      setCards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPaymentMethods();
    }, [])
  );

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPaymentMethods();
  };

  const handleSelectCard = async (id: string) => {
    try {
      console.log('💳 Setting default payment method:', id);
      const response = await setDefaultPaymentMethod(parseInt(id));

      if (response.success) {
        console.log('✅ Default payment method set');
        // Update local state
        setCards((prev) =>
          prev.map((card) => ({
            ...card,
            isDefault: card.id === id,
          }))
        );
      } else {
        Alert.alert('Error', 'Failed to set default payment method');
      }
    } catch (error) {
      console.error('❌ Error setting default payment method:', error);
      Alert.alert('Error', 'Failed to set default payment method');
    }
  };

  const handleRemoveCard = async (id: string, cardType: string, cardLast4: string) => {
    Alert.alert(
      'Remove Payment Method',
      `Are you sure you want to remove ${cardType} •••${cardLast4}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('💳 Deleting payment method:', id);
              const response = await deletePaymentMethod(parseInt(id));

              if (response.success) {
                console.log('✅ Payment method deleted');
                // Refresh the list
                await fetchPaymentMethods();
              } else {
                Alert.alert('Error', 'Failed to remove payment method');
              }
            } catch (error) {
              console.error('❌ Error deleting payment method:', error);
              Alert.alert('Error', 'Failed to remove payment method');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>Payment Methods</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {/* Payment Cards */}
        {cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payment methods</Text>
            <Text style={styles.emptySubtext}>Add a payment method to get started</Text>
          </View>
        ) : cards.map((card) => (
          <View key={card.id} style={styles.cardWrapper}>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handleSelectCard(card.id)}
              activeOpacity={0.7}
            >
              <Image
                source={card.icon}
                style={styles.cardIcon}
                resizeMode="contain"
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>•••• {card.cardNumber}</Text>
                <Text style={styles.cardExpiry}>Expires on {card.expiryDate}</Text>
              </View>

              {/* Remove Button - Left of Dot */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveCard(card.id, card.type, card.cardNumber)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require('../images/homepage-assets/trash.png')}
                  style={styles.removeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Radio Dot - Right */}
              <View style={[styles.radioButton, card.isDefault && styles.radioButtonSelected]}>
                {card.isDefault && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Payment Method Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPaymentMethod')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 32,
    paddingBottom: 120,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeIcon: {
    width: 20,
    height: 20,
    tintColor: '#DC2626',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 13,
    color: '#6C757D',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#026A49',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#026A49',
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
  addButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default PaymentMethodsScreen;
