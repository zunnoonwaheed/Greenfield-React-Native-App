import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { AppHeader } from '../components/shared/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { getCartContents, updateCart, removeFromCart, addToCart } from '../api/cart';
import { getProducts } from '../api/productAPI';

type CartNavigationProp = StackNavigationProp<MainStackParamList, 'Cart'>;

const ASSETS = {
  trash: require('../images/homepage-assets/trash.png'),
  plus: require('../images/homepage-assets/plus-cart.png'),
  minus: require('../images/homepage-assets/minus.png'),
  salt: require('../images/homepage-assets/salt.png'),
  olpers: require('../images/homepage-assets/olpers.png'),
  lobia: require('../images/homepage-assets/lobia.png'),
  greenChillies: require('../images/homepage-assets/green-chillies.png'),
  onions: require('../images/homepage-assets/onions.png'),
};

// Default fallback image - only used if backend doesn't return an image URL
const DEFAULT_PRODUCT_IMAGE = require('../images/homepage-assets/grocery-bun.png');

interface CartItem {
  id: number | string; // Can be number for products or "bundle_X" string for bundles
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

interface AddOnProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  discounted_price: number;
  discount_percentage: number;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [gst, setGst] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(3);
  const [finalTotal, setFinalTotal] = useState(0);
  const [currency, setCurrency] = useState('PKR');
  const [addOns, setAddOns] = useState<AddOnProduct[]>([]);

  // Load cart contents when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 CartScreen focused - loading cart and add-ons');
      loadCart();
      loadAddOns();
    }, [])
  );

  // Also load on mount
  useEffect(() => {
    console.log('🔄 CartScreen mounted - loading cart and add-ons');
    loadCart();
    loadAddOns();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await getCartContents();

      console.log('📦 Cart response:', response);

      if (response.success && response.data) {
        setItems(response.data.items || []);
        setSubtotal(response.data.subtotal || 0);
        setDeliveryCharge(response.data.delivery_charge || 0);
        setGst(response.data.gst || 0);
        setGstPercentage(response.data.gst_percentage || 3);
        setFinalTotal(response.data.total || 0);
        setCurrency(response.data.currency || 'PKR');
        console.log('✅ Cart loaded:', response.data.items.length, 'items');
        console.log('💰 Charges - Subtotal:', response.data.subtotal, 'Delivery:', response.data.delivery_charge, 'GST:', response.data.gst, 'Total:', response.data.total);
      } else {
        // If response is not successful, clear cart
        setItems([]);
        setSubtotal(0);
        setDeliveryCharge(0);
        setGst(0);
        setFinalTotal(0);
        console.log('⚠️ Cart cleared - no success response');
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      // On error, clear cart
      setItems([]);
      setSubtotal(0);
      setDeliveryCharge(0);
      setGst(0);
      setFinalTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const loadAddOns = async () => {
    try {
      // Fetch popular products as add-ons (products frequently bought together)
      const response = await getProducts({
        sort_by: 'popular',
        limit: 6
      });

      if (response.success && response.data && response.data.products) {
        setAddOns(response.data.products);
        console.log('✅ Add-ons loaded:', response.data.products.length, 'products');
      }
    } catch (error) {
      console.error('❌ Error loading add-ons:', error);
    }
  };

  const changeQty = async (id: number | string, delta: number) => {
    const item = items.find(it => it.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      // Remove item
      await handleRemoveItem(id);
    } else {
      // Update quantity
      try {
        const response = await updateCart(id, newQty);
        if (response.success) {
          await loadCart(); // Reload cart to get updated totals
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  const handleRemoveItem = async (id: number | string) => {
    try {
      const response = await removeFromCart(id);
      if (response.success) {
        await loadCart(); // Reload cart after removal
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddAddon = async (addon: AddOnProduct) => {
    try {
      console.log('🛒 Adding addon to cart:', addon.name, 'ID:', addon.id);

      // Don't send image_path - let backend construct full URL from database
      const response = await addToCart(addon.id, 1);

      if (response.success) {
        console.log('✅ Addon added successfully');
        await loadCart(); // Reload cart to show new item with updated totals
      }
    } catch (error) {
      console.error('❌ Error adding addon:', error);
    }
  };

  // Charges are now provided by backend - no need to calculate here

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppHeader title="Shopping cart" showBack showHome />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loadingText}>Loading cart...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Add some products to get started!</Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart items */}
            <View style={styles.listWrap}>
              {items.map((item, index) => {
                // Use actual product images from database
                let imageSource = DEFAULT_PRODUCT_IMAGE;

                if (item.image) {
                  // Check if it's a full URL (from database)
                  if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
                    imageSource = { uri: item.image };
                  }
                  // Check for local asset filenames (legacy support)
                  else if (item.image === 'grocery-bun.png') {
                    imageSource = require('../images/homepage-assets/grocery-bun.png');
                  } else if (item.image === 'green-chillies.png') {
                    imageSource = require('../images/homepage-assets/green-chillies.png');
                  } else if (item.image === 'onions.png') {
                    imageSource = require('../images/homepage-assets/onions.png');
                  }
                  // If it's just a filename without protocol, construct URL
                  else if (item.image.includes('.')) {
                    // Backend should send full URLs, but just in case handle filenames
                    console.warn('⚠️ Cart item has filename instead of full URL:', item.image);
                    // Use default image as fallback since we can't reliably construct the URL
                    imageSource = DEFAULT_PRODUCT_IMAGE;
                  }
                }

                return (
                <View key={`${item.id}-${index}`} style={styles.card}>
                  <Image
                    source={imageSource}
                    style={styles.thumb}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.meta}>
                      Quantity: {item.quantity}  •  Price: Rs. {item.price.toLocaleString()}
                    </Text>
                    <Text style={styles.subtotalText}>
                      Subtotal: Rs. {item.subtotal.toLocaleString()}
                    </Text>

                    <View style={styles.rowBetween}>
                      <View style={styles.qtyBar}>
                        <TouchableOpacity onPress={() => changeQty(item.id, -1)} style={styles.qtyBarBtn}>
                          <Image source={ASSETS.minus} style={styles.icon} />
                        </TouchableOpacity>

                        <View style={styles.qtyBarCenter}>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                        </View>

                        <TouchableOpacity onPress={() => changeQty(item.id, 1)} style={styles.qtyBarBtn}>
                          <Image source={ASSETS.plus} style={styles.icon} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.trashBtn}>
                        <Image source={ASSETS.trash} style={styles.trashIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                );
              })}
            </View>
          </>
        )}

        {/* Extra/Add-Ons - Only show when we have add-ons loaded */}
        {addOns.length > 0 && (
          <View style={styles.addOnSection}>
            <View style={styles.addOnHeader}>
              <Text style={styles.addOnTitle}>Extra/Add-Ons</Text>
              <View style={styles.optionalBadge}><Text style={styles.optionalText}>Optional</Text></View>
            </View>
            <Text style={styles.subText}>Other Customers Also Order These</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {addOns.map(addon => {
                const hasDiscount = addon.discount_percentage > 0;
                const displayPrice = hasDiscount && addon.discounted_price > 0 && addon.discounted_price < addon.price
                  ? addon.discounted_price
                  : addon.price;

                const addonImage = addon.image_url
                  ? { uri: addon.image_url }
                  : DEFAULT_PRODUCT_IMAGE;

                return (
                  <TouchableOpacity
                    key={addon.id}
                    style={styles.addOnCard}
                    onPress={() => navigation.navigate('ProductDetail', { productId: addon.id.toString() })}
                  >
                    <View style={styles.addOnImageContainer}>
                      <Image source={addonImage} style={styles.addOnImage} />
                      {hasDiscount && (
                        <View style={styles.discountBadge}>
                          <Ionicons name="flash" size={12} color="#000" />
                          <Text style={styles.discountText}>-{addon.discount_percentage}%</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addOnName} numberOfLines={1} ellipsizeMode="tail">{addon.name}</Text>
                    <Text style={styles.addOnPrice}>Rs. {displayPrice.toLocaleString()}</Text>
                    <TouchableOpacity
                      style={styles.addOnCTA}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddAddon(addon);
                      }}
                    >
                      <Text style={styles.addOnCTAText}>Add To Cart</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Charges - Only show when cart has items */}
        {!loading && items.length > 0 && (
          <>
            <View style={styles.sectionPad}>
              <Text style={styles.sectionTitle}>Subtotal</Text>
              <View style={styles.box}>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Items Total</Text>
                  <Text style={styles.blackText}>Rs. {subtotal.toLocaleString()}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Delivery Charges</Text>
                  <Text style={styles.blackText}>Rs. {deliveryCharge.toLocaleString()}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>GST ({gstPercentage}%)</Text>
                  <Text style={styles.blackText}>Rs. {gst.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            {/* Final amount */}
            <View style={styles.sectionPad}>
              <Text style={styles.sectionTitle}>Final Amount</Text>
              <View style={styles.totalBox}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.totalLabel}>Total amount</Text>
                    <Text style={styles.itemsNote}>
                      Total items: <Text style={styles.itemsCount}>{items.length}</Text>
                    </Text>
                  </View>
                  <Text style={styles.totalValue}>Rs. {finalTotal.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Checkout button (fixed) - Only show when cart has items */}
      {!loading && items.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('AddNewAddressConfirm', { address: {} })}
          >
            <Text style={styles.checkoutText}>Checkout - Rs. {finalTotal.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const GREEN = '#026A49';
const PILL = '#2DDA95';
const YELLOW = '#FAB001';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listWrap: { paddingHorizontal: 24, paddingTop: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  thumb: { width: 52, height: 52, marginRight: 12 },
  title: { fontSize: Typography.body, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  meta: { fontSize: Typography.caption, color: Colors.textLight, marginBottom: 4 },
  subtotalText: { fontSize: 14, fontWeight: '700', color: GREEN, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textLight,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: GREEN,
    borderRadius: 12,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  qtyBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBFEF4',
    borderRadius: 8,
    height: 38,
    borderWidth: 1.5,
    borderColor: PILL,
    marginRight: 12,
  },
  qtyBarBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { width: 12, height: 12, resizeMode: 'contain' },

  qtyBarCenter: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: { fontSize: 16, fontWeight: '700', color: GREEN },

  trashBtn: {
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
  },
  trashIcon: { width: 20, height: 20, resizeMode: 'contain' },

  addOnSection: { marginTop: 10, paddingHorizontal: 24 },
  addOnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addOnTitle: { fontSize: Typography.body, fontWeight: '700', color: Colors.text },
  optionalBadge: {
    backgroundColor: '#E8FFF3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  optionalText: { fontSize: 12, fontWeight: '700', color: '#0A8F62' },
  subText: { color: Colors.textLight, marginTop: 6, marginBottom: 12 },

  addOnCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    marginRight: 12,
  },
  addOnImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  addOnImage: { width: '100%', height: 100, borderRadius: 12 },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: YELLOW,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  addOnName: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  addOnPrice: { fontSize: 12, fontWeight: '700', color: GREEN, marginBottom: 8 },
  addOnCTA: {
    height: 38, borderRadius: 10, backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
  },
  addOnCTAText: { color: '#fff', fontWeight: '700' },

  sectionPad: { paddingHorizontal: 24, marginTop: 18 },
  sectionTitle: { fontSize: Typography.body, fontWeight: '700', color: Colors.text, marginBottom: 12 },

  box: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    padding: 14, gap: 8,
  },
  grayText: { color: Colors.textLight, fontSize: 14 },
  blackText: { color: Colors.text, fontSize: 14, fontWeight: '600' },

  totalBox: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 16,
    padding: 14,
  },
  totalLabel: { fontSize: 14, color: Colors.text },
  itemsNote: { fontSize: 12, color: Colors.text, marginTop: 4 },
  itemsCount: { fontSize: 12, color: YELLOW, fontWeight: '600' },
  totalValue: { fontSize: 16, fontWeight: '700', color: GREEN },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: Colors.border,
  },
  checkoutBtn: {
    height: 52, borderRadius: 14, backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default CartScreen;