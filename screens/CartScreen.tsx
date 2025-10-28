import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { AppHeader } from '../components/shared/AppHeader';
import { ThemedButton } from '../components/ThemedButton';

type CartNavigationProp = StackNavigationProp<MainStackParamList, 'Cart'>;

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface AddOnItem {
  id: string;
  name: string;
  price: number;
  image: any;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Fresh Vegetable Bundle', size: 'Size: Small  •  Quantity: 2  •  Price: Rs.12,000', price: 1200, quantity: 1, image: '🥬' },
    { id: '2', name: 'Milk – 1 Litre', size: 'Size: Medium  •  Quantity: 1  •  Price: Rs.14,500', price: 145, quantity: 1, image: '🥛' },
    { id: '3', name: 'Eggs – 12 pcs', size: 'Size: Large  •  Quantity: 1  •  Price: Rs.U,500', price: 500, quantity: 1, image: '🥚' },
  ]);

  const addOns: AddOnItem[] = [
    { id: '1', name: 'Green Chilies (250g)', price: 100, image: require('../images/homepage-assets/home-grocery1.png') },
    { id: '2', name: 'Lemon Pack (500g)', price: 150, image: require('../images/homepage-assets/home-grocery2.png') },
    { id: '3', name: 'Onions - Extra 1kg', price: 160, image: require('../images/homepage-assets/home-grocery1.png') },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = 2100;
  const gst = Math.round(subtotal * 0.10);
  const finalAmount = subtotal + deliveryCharges + gst;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppHeader title="Shopping Cart" showBack={true} showHome={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItems}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItemCard}>
              <View style={styles.itemImageContainer}>
                <Text style={styles.itemImage}>{item.image}</Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>{item.size}</Text>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => updateQuantity(item.id, -item.quantity)}
              >
                <Text style={styles.removeIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Extra/Add-Ons */}
        <View style={styles.addOnsSection}>
          <View style={styles.addOnsHeader}>
            <Text style={styles.addOnsTitle}>Extra/Add-Ons</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.addOnsScroll}
          >
            {addOns.map((item) => (
              <View key={item.id} style={styles.addOnCard}>
                <Image source={item.image} style={styles.addOnImage} resizeMode="cover" />
                <Text style={styles.addOnName}>{item.name}</Text>
                <Text style={styles.addOnPrice}>+PKR {item.price}</Text>
                <TouchableOpacity style={styles.addOnButton}>
                  <Text style={styles.addOnButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Subtotal Section */}
        <View style={styles.subtotalSection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs.{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>Rs.{deliveryCharges}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST</Text>
            <Text style={styles.summaryValue}>Rs.{gst}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.finalLabel}>Final Amount</Text>
            <Text style={styles.finalValue}>Rs.{finalAmount}</Text>
          </View>
          <Text style={styles.totalItemsText}>Total Items: {cartItems.length}</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.bottomBar}>
        <ThemedButton
          title="Checkout"
          onPress={() => navigation.navigate('AddNewAddressConfirm', { address: {} })}
          type="solid"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.gap,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: Layout.avatarSize,
    height: Layout.avatarSize,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: Typography.h3,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: Typography.h5,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  placeholder: {
    width: Layout.avatarSize,
  },
  scrollView: {
    flex: 1,
  },
  cartItems: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.medium,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.gap,
    marginBottom: Spacing.gap,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.gap,
  },
  itemImage: {
    fontSize: 36,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  itemSize: {
    fontSize: Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.small,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.xs,
    gap: Spacing.gap,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: Spacing.xl,
    height: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: Typography.h5,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  quantityValue: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    minWidth: Layout.iconSize,
    textAlign: 'center',
  },
  removeButton: {
    width: Spacing.xl,
    height: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: Typography.h4,
  },
  addOnsSection: {
    marginTop: Spacing.medium,
    paddingHorizontal: Spacing.screenPadding,
  },
  addOnsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.gap,
  },
  addOnsTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  optionalBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.gap,
  },
  optionalText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: '#059669',
  },
  addOnsScroll: {
    paddingRight: Spacing.screenPadding,
  },
  addOnCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.small,
    marginRight: Spacing.gap,
  },
  addOnImage: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.small,
  },
  addOnName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  addOnPrice: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.accent,
    marginBottom: Spacing.small,
  },
  addOnButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    paddingVertical: Spacing.xs + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnButtonText: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.background,
  },
  subtotalSection: {
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.sectionSpacing,
    padding: Spacing.medium,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  summaryLabel: {
    fontSize: Typography.body,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.gap,
  },
  finalLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  finalValue: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  totalItemsText: {
    fontSize: Typography.bodySmall,
    color: Colors.textLight,
    marginTop: Spacing.small,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
  },
});

export default CartScreen;
