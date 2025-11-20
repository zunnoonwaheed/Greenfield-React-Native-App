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
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { AppHeader } from '../components/shared/AppHeader';
import { Ionicons } from '@expo/vector-icons';

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

interface CartItem {
  id: string;
  title: string;
  meta: string;
  qty: number;
  image: any;
}

interface AddOnItem {
  id: string;
  name: string;
  price: string;
  image: any;
  discount?: string;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();

  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'National Iodized Pink Himalayan Salt 800g',
      meta: 'Size: Small  •  Quantity: 2  •  Price: Rs. 12,000',
      qty: 2,
      image: ASSETS.salt,
    },
    {
      id: '2',
      title: 'Olpers Flavored Milk Chocolate 180ml (Pack of 24)',
      meta: 'Size: Medium  •  Quantity: 1  •  Price: Rs. 14,500',
      qty: 1,
      image: ASSETS.olpers,
    },
    {
      id: '3',
      title: 'Greenfield Red Lobia Special (Kidney Beans) 1kg',
      meta: 'Size: Large  •  Quantity: 1  •  Price: Rs. 17,500',
      qty: 1,
      image: ASSETS.lobia,
    },
  ]);

  const addOns: AddOnItem[] = [
    { id: 'a1', name: 'Green Chilies (250g)', price: 'Rs. 70', image: ASSETS.greenChillies, discount: '%-X23' },
    { id: 'a2', name: 'Lemon Pack (500g)', price: 'Rs. 150', image: ASSETS.onions, discount: '%-X23' }, // using onions.png as in folder list
  ];

  const changeQty = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(it => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter(it => it.qty > 0)
    );
  };

  // Numbers to match the Figma
  const delivery = 3200;
  const gst = 1600;
  const finalAmount = 96000;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppHeader title="Shopping cart" showBack showHome />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Cart items */}
        <View style={styles.listWrap}>
          {items.map(item => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.thumb} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.meta}</Text>

                <View style={styles.rowBetween}>
                  <View style={styles.qtyBar}>
                    <TouchableOpacity onPress={() => changeQty(item.id, -1)} style={styles.qtyBarBtn}>
                      <Image source={ASSETS.minus} style={styles.icon} />
                    </TouchableOpacity>

                    <View style={styles.qtyBarCenter}>
                      <Text style={styles.qtyText}>{item.qty}</Text>
                    </View>

                    <TouchableOpacity onPress={() => changeQty(item.id, 1)} style={styles.qtyBarBtn}>
                      <Image source={ASSETS.plus} style={styles.icon} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => changeQty(item.id, -item.qty)} style={styles.trashBtn}>
                    <Image source={ASSETS.trash} style={styles.trashIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Extra/Add-Ons */}
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
            {addOns.map(x => (
              <View key={x.id} style={styles.addOnCard}>
                <View style={styles.addOnImageContainer}>
                  <Image source={x.image} style={styles.addOnImage} />
                  {x.discount && (
                    <View style={styles.discountBadge}>
                      <Ionicons name="flash" size={12} color="#000" />
                      <Text style={styles.discountText}>{x.discount}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addOnName} numberOfLines={1} ellipsizeMode="tail">{x.name}</Text>
                <Text style={styles.addOnPrice}>{x.price}</Text>
                <TouchableOpacity style={styles.addOnCTA}>
                  <Text style={styles.addOnCTAText}>Add To Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Charges */}
        <View style={styles.sectionPad}>
          <Text style={styles.sectionTitle}>Subtotal</Text>
          <View style={styles.box}>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Delivery Charges</Text>
              <Text style={styles.blackText}>Rs. {delivery.toLocaleString()}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>GST</Text>
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
              <Text style={styles.totalValue}>Rs. {finalAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout button (fixed) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('AddNewAddressConfirm', { address: {} })}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
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
  meta: { fontSize: Typography.caption, color: Colors.textLight, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

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
