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
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../constants/theme';

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

        <View style={{ height: Spacing.xxl * 3 }} />
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
  scrollView: {
    flex: 1,
  },
  imageBanner: {
    width: '100%',
    height: Layout.bannerHeight,
    backgroundColor: Colors.gray[100],
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.screenPadding,
    paddingBottom: Spacing.padding,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.gap,
  },
  productTitle: {
    flex: 1,
    fontSize: Typography.h5,
    fontWeight: Typography.semibold,
    color: Colors.text,
    lineHeight: Typography.h3,
    marginRight: Spacing.gap,
  },
  productPrice: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  productDescription: {
    fontSize: Typography.body,
    color: Colors.textLight,
    lineHeight: Typography.h4,
    marginBottom: Spacing.padding,
  },
  discountSection: {
    marginBottom: Spacing.screenPadding,
  },
  discountBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.gap,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  reviewsSection: {
    marginBottom: Spacing.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  reviewsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  ratingText: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.text,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.xs / 2,
  },
  star: {
    fontSize: Typography.body,
    color: Colors.warning,
  },
  featuresSection: {
    marginBottom: Spacing.small,
  },
  featureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  featureTag: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.gap,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.md,
  },
  featureText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.successDark,
  },
  addOnsSection: {
    backgroundColor: Colors.gray[50],
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.screenPadding,
  },
  addOnsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.padding,
  },
  addOnsTitle: {
    fontSize: 17,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  addOnsSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textLight,
  },
  optionalBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.small + Spacing.xs / 2,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.gap,
  },
  optionalText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.successDark,
  },
  addOnsList: {
    gap: Spacing.gap,
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.gap,
    gap: Spacing.gap,
  },
  checkbox: {
    width: Spacing.screenPadding,
    height: Spacing.screenPadding,
    borderRadius: BorderRadius.xs,
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
    width: Spacing.small + Spacing.xs / 2,
    height: Spacing.small - Spacing.xs / 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.surface,
    transform: [{ rotate: '-45deg' }],
    marginTop: -Spacing.xs / 2,
  },
  addOnImageContainer: {
    width: Layout.inputHeight,
    height: Layout.inputHeight,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnImage: {
    fontSize: Typography.h3,
  },
  addOnInfo: {
    flex: 1,
  },
  addOnName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  addOnPrice: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.accent,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    gap: Spacing.small,
  },
  quantityButton: {
    width: Spacing.large + Spacing.xs,
    height: Spacing.large + Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
  },
  quantityButtonText: {
    fontSize: 17,
    color: Colors.textLight,
    fontWeight: Typography.medium,
  },
  quantityValue: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.text,
    minWidth: Spacing.padding,
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
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.padding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gap,
    ...(Shadows?.large || {}),
  },
  mainQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    gap: Spacing.small,
  },
  mainQuantityButton: {
    width: Layout.avatarSize,
    height: Layout.avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  mainQuantityButtonText: {
    fontSize: Typography.h5,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  mainQuantityValue: {
    fontSize: 17,
    fontWeight: Typography.bold,
    color: Colors.text,
    minWidth: Layout.iconSize,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.small + Spacing.small - Spacing.xs / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Shadows?.medium || {}),
  },
  addToCartButtonText: {
    fontSize: 17,
    fontWeight: Typography.semibold,
    color: Colors.surface,
  },
});

export default ProductDetailScreen;
