import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width, height } = Dimensions.get('window');

type ProductDetailNavigationProp = StackNavigationProp<RootStackParamList>;

interface AddOn {
  id: string;
  name: string;
  price: number;
  image: string;
  selected: boolean;
  quantity: number;
}

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const [mainQuantity, setMainQuantity] = useState(1);

  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: '1', name: 'Milk – 1 Liter', price: 220, image: '🥛', selected: true, quantity: 1 },
    { id: '2', name: 'Eggs – 12 pcs', price: 350, image: '🥚', selected: true, quantity: 1 },
    { id: '3', name: 'Coriander & Mint Pack', price: 60, image: '🌿', selected: false, quantity: 0 },
  ]);

  const [seasonings, setSeasonings] = useState<AddOn[]>([
    { id: '1', name: 'Green Chilies (250g)', price: 70, image: '🌶️', selected: true, quantity: 1 },
    { id: '2', name: 'Lemon Pack (500g)', price: 120, image: '🍋', selected: true, quantity: 1 },
    { id: '3', name: 'Onions – Extra 1kg', price: 160, image: '🧅', selected: false, quantity: 0 },
  ]);

  const toggleAddOn = (id: string, section: 'addOns' | 'seasonings') => {
    const setter = section === 'addOns' ? setAddOns : setSeasonings;
    const items = section === 'addOns' ? addOns : seasonings;

    setter(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          selected: !item.selected,
          quantity: !item.selected ? 1 : 0,
        };
      }
      return item;
    }));
  };

  const updateQuantity = (id: string, delta: number, section: 'addOns' | 'seasonings') => {
    const setter = section === 'addOns' ? setAddOns : setSeasonings;
    const items = section === 'addOns' ? addOns : seasonings;

    setter(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return {
          ...item,
          quantity: newQuantity,
          selected: newQuantity > 0,
        };
      }
      return item;
    }));
  };

  const renderAddOnItem = (item: AddOn, section: 'addOns' | 'seasonings') => (
    <View key={item.id} style={styles.addOnCard}>
      <TouchableOpacity
        onPress={() => toggleAddOn(item.id, section)}
        style={[styles.checkbox, item.selected && styles.checkboxSelected]}
      >
        {item.selected && (
          <View style={styles.checkmark} />
        )}
      </TouchableOpacity>

      <View style={styles.addOnImageContainer}>
        <Text style={styles.addOnImage}>{item.image}</Text>
      </View>

      <View style={styles.addOnInfo}>
        <Text style={styles.addOnName}>{item.name}</Text>
        <Text style={styles.addOnPrice}>+PKR {item.price}</Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1, section)}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1, section)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image Banner */}
        <View style={styles.imageBanner}>
          <Image
            source={require('../images/bundles-banner.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>
              Fresh Vegetables Bundle –{'\n'}Weekly Pack
            </Text>
            <Text style={styles.productPrice}>PKR 1,499</Text>
          </View>

          <Text style={styles.productDescription}>
            This pack includes potatoes, onions, tomatoes, spinach, cucumber, and carrots – enough for a week's cooking. Perfect for families who want freshness and savings in one go.
          </Text>

          {/* Discount */}
          <View style={styles.discountSection}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>₹ -₹23</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.reviewsContent}>
              <Text style={styles.ratingText}>4.3/5.0</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>★</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureTags}>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>Fresh, hand-picked produce</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>Sourced from local farms</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureText}>Clean, hygienic packaging</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Extra/Add-Ons */}
        <View style={styles.addOnsSection}>
          <View style={styles.addOnsHeader}>
            <View>
              <Text style={styles.addOnsTitle}>Extra/Add-Ons</Text>
              <Text style={styles.addOnsSubtitle}>Other Customers Also Order These</Text>
            </View>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <View style={styles.addOnsList}>
            {addOns.map((item) => renderAddOnItem(item, 'addOns'))}
          </View>
        </View>

        {/* Fresh Herbs & Seasoning */}
        <View style={styles.addOnsSection}>
          <View style={styles.addOnsHeader}>
            <View>
              <Text style={styles.addOnsTitle}>Fresh Herbs & Seasoning</Text>
              <Text style={styles.addOnsSubtitle}>Other Customers Also Order These</Text>
            </View>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <View style={styles.addOnsList}>
            {seasonings.map((item) => renderAddOnItem(item, 'seasonings'))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Cart Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.mainQuantityControls}>
          <TouchableOpacity
            style={styles.mainQuantityButton}
            onPress={() => setMainQuantity(Math.max(1, mainQuantity - 1))}
          >
            <Text style={styles.mainQuantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.mainQuantityValue}>{mainQuantity}</Text>
          <TouchableOpacity
            style={styles.mainQuantityButton}
            onPress={() => setMainQuantity(mainQuantity + 1)}
          >
            <Text style={styles.mainQuantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => navigation.navigate('Cart' as any)}>
          <Text style={styles.addToCartButtonText}>Add To Cart</Text>
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
  scrollView: {
    flex: 1,
  },
  imageBanner: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.gray[100],
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productTitle: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    lineHeight: 24,
    marginRight: 12,
  },
  productPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  productDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    lineHeight: 20,
    marginBottom: 16,
  },
  discountSection: {
    marginBottom: 20,
  },
  discountBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  reviewsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
    color: Colors.warning,
  },
  featuresSection: {
    marginBottom: 8,
  },
  featureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  featureText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: '#059669',
  },
  addOnsSection: {
    backgroundColor: Colors.gray[50],
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addOnsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addOnsTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  addOnsSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.placeholder,
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
  addOnsList: {
    gap: 12,
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.surface,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  addOnImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnImage: {
    fontSize: 24,
  },
  addOnInfo: {
    flex: 1,
  },
  addOnName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  addOnPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: 4,
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  quantityValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    minWidth: 16,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.lg,
  },
  mainQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    padding: 4,
    gap: 8,
  },
  mainQuantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  mainQuantityButtonText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  mainQuantityValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  addToCartButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.surface,
  },
});

export default ProductDetailScreen;
