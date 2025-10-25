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
import type { RootStackParamList } from '../App';
import { Colors, Typography, BorderRadius, Shadows } from '../constants/theme';

type CartNavigationProp = StackNavigationProp<RootStackParamList>;

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.placeholder} />
      </SafeAreaView>

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
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('AddNewAddressConfirm' as any)}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text.secondary,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  cartItems: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    marginBottom: 12,
    ...Shadows.sm,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemImage: {
    fontSize: 36,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 12,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  quantityValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 20,
  },
  addOnsSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  addOnsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addOnsTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  optionalBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optionalText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: '#059669',
  },
  addOnsScroll: {
    paddingRight: 20,
  },
  addOnCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 10,
    marginRight: 12,
    ...Shadows.sm,
  },
  addOnImage: {
    width: '100%',
    height: 80,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
  },
  addOnName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  addOnPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    marginBottom: 8,
  },
  addOnButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background,
  },
  subtotalSection: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  finalLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  finalValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  totalItemsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...Shadows.lg,
  },
  checkoutButton: {
    backgroundColor: '#0A7D44',
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  checkoutButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.surface,
  },
});

export default CartScreen;
