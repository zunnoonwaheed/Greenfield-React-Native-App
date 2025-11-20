/**
 * AddNewAddressConfirmScreen - Confirm Order Details with Address
 * Pixel-perfect match to screenshot design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { addLocation } from '../api/locationAPI';
import PaymentCardModal, { CardDetails } from '../components/PaymentCardModal';
import { AppHeader } from '../components/shared/AppHeader';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { ThemedButton } from '../components/ThemedButton';

type AddNewAddressConfirmScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'AddNewAddressConfirm'
>;
type AddNewAddressConfirmScreenRouteProp = RouteProp<
  MainStackParamList,
  'AddNewAddressConfirm'
>;

type LabelType = 'Home' | 'Office' | 'Other';

interface RouteParams {
  totalAmount?: number;
  cartItems?: any[];
}

const AddNewAddressConfirmScreen: React.FC = () => {
  const navigation = useNavigation<AddNewAddressConfirmScreenNavigationProp>();
  const route = useRoute<AddNewAddressConfirmScreenRouteProp>();
  const { totalAmount = 1100, cartItems = [] } = (route.params as RouteParams) || {};

  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Form fields
  const [searchLocation, setSearchLocation] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('Home');

  // Address location data
  const [city] = useState('Karachi');
  const [area] = useState('DHA');
  const [sector, setSector] = useState('Phase 2');

  // Order preferences
  const [orderType, setOrderType] = useState<'door' | 'shop'>('door');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [bringCardMachine, setBringCardMachine] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [savedCard, setSavedCard] = useState<CardDetails | null>(null);

  // Mock order data
  const orderItems = [
    { name: 'Fresh Vegetable Bundle', qty: 1, price: 750 },
    { name: 'Milk – 1 Litre', qty: 1, price: 200 },
    { name: 'Eggs – 12 Pcs', qty: 1, price: 240 },
    { name: 'Green Chilies (250g)', qty: 1, price: 100 },
    { name: 'Lemon Pack (500g)', qty: 1, price: 100 },
  ];

  const tax = 175;
  const discount = 185;
  const finalAmountCalc = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0) + tax - discount;

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = (): boolean => {
    // Relaxed validation - not all fields required for order placement
    return true;
  };

  const handleAddCard = (cardDetails: CardDetails) => {
    setSavedCard(cardDetails);
    setPaymentMethod('card');
    setShowPaymentModal(false);
    Alert.alert('Success', 'Card added successfully!');
  };

  const handleAddAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const locationData = {
        city: city,
        area: area,
        sector: searchLocation.trim() || sector,
        street_number: floor,
        property_type: selectedLabel === 'Office' ? 'apartment' : 'house',
        house_number: `${buildingName}, Flat ${flat}`,
      };

      const response = await addLocation(locationData);

      if (response.success) {
        Alert.alert('Success', 'Address added successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setPlacingOrder(true);

    // Simulate order processing (offline mode - no API call required)
    setTimeout(() => {
      setPlacingOrder(false);
      // Navigate directly to Order Confirmed screen
      navigation.navigate('OrderConfirmed', { orderId: 'ORD' + Date.now() });
    }, 1000); // 1 second delay for UX
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Image
              source={require('../images/homepage-assets/arrow-back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Order Details</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#9E9E9E"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search location"
                placeholderTextColor="#9E9E9E"
                value={searchLocation}
                onChangeText={setSearchLocation}
              />
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.mapContainer}>
            <Image
              source={require('../images/homepage-assets/map-address.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>

          {/* Delivery Address Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.simpleAddressText}>Sky Avenue, Street 5, House 14, DHA Phase 2</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Add another address"
              placeholderTextColor="#9E9E9E"
              value={buildingName}
              onChangeText={setBuildingName}
              multiline
            />
          </View>

          {/* Special Requests/Instructions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Special Requests/Instructions</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Write instructions what you want us to know..."
              placeholderTextColor="#9E9E9E"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Order Type */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order Type</Text>
            <View style={styles.radioGroupRow}>
              <TouchableOpacity
                style={styles.radioOptionCard}
                onPress={() => setOrderType('door')}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {orderType === 'door' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Leave at the door</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOptionCard}
                onPress={() => setOrderType('shop')}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {orderType === 'shop' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Pick up from Shop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <View style={styles.radioGroupRow}>
              <TouchableOpacity
                style={styles.radioOptionCard}
                onPress={() => setPaymentMethod('cash')}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {paymentMethod === 'cash' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Cash on Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOptionCard}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {paymentMethod === 'card' && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>Card Payment</Text>
              </TouchableOpacity>
            </View>

            {/* Show saved card info if card added */}
            {savedCard && paymentMethod === 'card' && (
              <View style={styles.savedCardInfo}>
                <Ionicons name="card" size={20} color="#0A8A4E" />
                <Text style={styles.savedCardText}>
                  Card ending in •••• {savedCard.cardNumber.replace(/\s/g, '').slice(-4)}
                </Text>
              </View>
            )}

            {/* Add Card Button */}
            {paymentMethod === 'card' && (
              <TouchableOpacity
                style={styles.addCardButton}
                onPress={() => setShowPaymentModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle-outline" size={20} color="#0A8A4E" />
                <Text style={styles.addCardButtonText}>
                  {savedCard ? 'Change Card' : 'Add Card Details'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setBringCardMachine(!bringCardMachine)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, bringCardMachine && styles.checkboxChecked]}>
                {bringCardMachine && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Bring Card Machine to Door</Text>
            </TouchableOpacity>
          </View>

          {/* Discount Code */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Discount code</Text>
            <View style={styles.discountCodeRow}>
              <TextInput
                style={styles.discountCodeInput}
                placeholder="Discount code"
                placeholderTextColor="#9E9E9E"
                value={discountCode}
                onChangeText={setDiscountCode}
              />
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.orderSummaryCard}>
              {orderItems.map((item, index) => (
                <View key={index} style={styles.orderItemRow}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemPrice}>Rs.{item.price}</Text>
                </View>
              ))}

              <View style={styles.orderDivider} />

              <View style={styles.orderItemRow}>
                <Text style={styles.orderItemName}>Tax</Text>
                <Text style={styles.orderItemPrice}>10% (Rs.{tax})</Text>
              </View>

              <View style={styles.orderItemRow}>
                <Text style={styles.orderItemName}>Discount</Text>
                <Text style={[styles.orderItemPrice, styles.discountAmount]}>5% (Rs.{discount})</Text>
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderItemRow}>
                <Text style={styles.finalAmountLabel}>Final Amount</Text>
                <Text style={styles.finalAmountValue}>Rs.{finalAmountCalc}</Text>
              </View>

              <View style={styles.totalAmountRow}>
                <View>
                  <Text style={styles.totalAmountLabel}>Total amount</Text>
                  <Text style={styles.totalItemsLabel}>
                    Total items: <Text style={styles.totalItemsNumber}>{orderItems.length}</Text>
                  </Text>
                </View>
                <Text style={styles.totalAmountValue}>Rs. {finalAmountCalc.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Address Form (Hidden for now - can be shown when "Add Other Address" is clicked) */}
          <View style={[styles.formSection, { display: 'none' }]}>
            {/* Building Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Building name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter"
                placeholderTextColor="#9E9E9E"
                value={buildingName}
                onChangeText={setBuildingName}
              />
            </View>

            {/* Flat */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Flat</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter"
                placeholderTextColor="#9E9E9E"
                value={flat}
                onChangeText={setFlat}
              />
            </View>

            {/* Floor */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Floor</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter"
                placeholderTextColor="#9E9E9E"
                value={floor}
                onChangeText={setFloor}
                keyboardType="numeric"
              />
            </View>

            {/* Company Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter"
                placeholderTextColor="#9E9E9E"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            {/* Instructions for Driver */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instructions for driver</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter"
                placeholderTextColor="#9E9E9E"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Add Label Section */}
            <View style={styles.labelSection}>
              <Text style={styles.label}>Add Label</Text>
              <View style={styles.labelButtons}>
                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Home' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Home')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="home"
                    size={20}
                    color={selectedLabel === 'Home' ? '#FFFFFF' : '#757575'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Home' && styles.labelButtonTextActive,
                    ]}
                  >
                    Home
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Office' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Office')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="briefcase"
                    size={20}
                    color={selectedLabel === 'Office' ? '#FFFFFF' : '#757575'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Office' && styles.labelButtonTextActive,
                    ]}
                  >
                    Office
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.labelButton,
                    selectedLabel === 'Other' && styles.labelButtonActive,
                  ]}
                  onPress={() => setSelectedLabel('Other')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={selectedLabel === 'Other' ? '#FFFFFF' : '#757575'}
                  />
                  <Text
                    style={[
                      styles.labelButtonText,
                      selectedLabel === 'Other' && styles.labelButtonTextActive,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Add Address Button */}
            <TouchableOpacity
              style={[styles.addAddressButton, loading && styles.buttonDisabled]}
              onPress={handleAddAddress}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.addAddressButtonText}>Add Address</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Place Order Button */}
          <View style={styles.placeOrderSection}>
            <ThemedButton
              title="Place Order"
              onPress={handlePlaceOrder}
              type="solid"
              disabled={placingOrder}
              loading={placingOrder}
            />
          </View>
        </ScrollView>

        {/* Payment Card Modal */}
        <PaymentCardModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onAddCard={handleAddCard}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  simpleAddressText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 12,
  },
  addressInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  instructionsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    gap: 12,
  },
  radioGroupRow: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOptionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0A8A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0A8A4E',
  },
  radioLabel: {
    fontSize: 14,
    color: '#424242',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0A8A4E',
    borderColor: '#0A8A4E',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#424242',
  },
  savedCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  savedCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A8A4E',
    fontFamily: 'Poppins',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0A8A4E',
    paddingVertical: 12,
    marginTop: 12,
  },
  addCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A8A4E',
    fontFamily: 'Poppins',
  },
  discountCodeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  discountCodeInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  applyButton: {
    backgroundColor: '#EF5D21',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 14,
    color: '#424242',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  discountAmount: {
    color: '#0A8A4E',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  finalAmountLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  finalAmountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
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
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  labelSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  labelButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  labelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  labelButtonActive: {
    backgroundColor: '#0A8A4E',
    borderColor: '#0A8A4E',
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  labelButtonTextActive: {
    color: '#FFFFFF',
  },
  addAddressButton: {
    backgroundColor: '#0A8A4E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  totalAmountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  totalItemsLabel: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  totalItemsNumber: {
    fontSize: 12,
    color: '#FAB001',
    fontWeight: '600',
  },
  placeOrderSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AddNewAddressConfirmScreen;
