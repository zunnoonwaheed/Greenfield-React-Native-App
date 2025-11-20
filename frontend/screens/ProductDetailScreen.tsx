import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface AddonProduct {
  id: string;
  name: string;
  price: string;
  image: any;
  discount: string;
}

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);

  const extraAddOns: AddonProduct[] = [
    {
      id: '1',
      name: 'Milk – 1 Liter',
      price: '+Rs. 220',
      image: require('../images/homepage-assets/milk.png'),
      discount: '-23%',
    },
    {
      id: '2',
      name: 'Eggs – 12 pcs',
      price: '+Rs. 350',
      image: require('../images/homepage-assets/eggs.png'),
      discount: '-23%',
    },
  ];

  const freshHerbs: AddonProduct[] = [
    {
      id: '1',
      name: 'Green Chillies (250g)',
      price: '+Rs. 70',
      image: require('../images/homepage-assets/green-chillies.png'),
      discount: '-23%',
    },
    {
      id: '2',
      name: 'Lemon Pack (500g)',
      price: '+Rs. 150',
      image: require('../images/homepage-assets/onions.png'),
      discount: '-23%',
    },
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const renderAddonCard = (item: AddonProduct) => (
    <View key={item.id} style={styles.addonCard}>
      {/* Discount Badge */}
      <View style={styles.addonDiscount}>
        <Text style={styles.discountIcon}>⚡︎</Text>
        <Text style={styles.addonDiscountText}>{item.discount}</Text>
      </View>

      {/* Product Image */}
      <Image source={item.image} style={styles.addonImage} resizeMode="cover" />

      {/* Product Info */}
      <View style={styles.addonInfo}>
        <Text style={styles.addonName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.addonPrice}>{item.price}</Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addonAddButton}>
        <Text style={styles.addonAddButtonText}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/homepage-assets/fresh-vegetable.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Back Button on Image */}
          <SafeAreaView style={styles.imageHeader} edges={['top']}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Product Details */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.productTitle}>Fresh Vegetables Bundle –{'\n'}Weekly Pack</Text>
            </View>
            <Text style={styles.productPrice}>Rs. 1,499</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            This pack includes potatoes, onions, tomatoes, spinach, cucumber, and carrots - enough for a week's cooking. Perfect for families who want freshness and savings in one go.
          </Text>

          {/* Discount */}
          <Text style={styles.sectionTitle}>Discount</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountIcon}>⚡︎</Text>
            <Text style={styles.discountBadgeText}>-23%</Text>
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewScore}>4.3/5.0</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.starIcon}>★</Text>
              ))}
            </View>
          </View>

          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featureChip}>
              <Text style={styles.featureText}>Fresh, hand-picked</Text>
            </View>
            <View style={styles.featureChip}>
              <Text style={styles.featureText}>Local farms</Text>
            </View>
            <View style={styles.featureChip}>
              <Text style={styles.featureText}>Hygienic packaging</Text>
            </View>
          </View>

        </View>

        {/* Extra/Add-Ons */}
        <View style={styles.addonSection}>
          <View style={styles.addonHeader}>
            <View>
              <Text style={styles.addonSectionTitle}>Extra/Add-Ons</Text>
              <Text style={styles.addonSectionSubtitle}>Other Customers Also Order These</Text>
            </View>
            <Text style={styles.optionalBadge}>Optional</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.addonScroll}
            contentContainerStyle={styles.addonScrollContent}
          >
            {extraAddOns.map(renderAddonCard)}
          </ScrollView>
        </View>

        {/* Fresh Herbs & Seasoning */}
        <View style={styles.addonSection}>
          <View style={styles.addonHeader}>
            <View>
              <Text style={styles.addonSectionTitle}>Fresh Herbs & Seasoning</Text>
              <Text style={styles.addonSectionSubtitle}>Other Customers Also Order These</Text>
            </View>
            <Text style={styles.optionalBadge}>Optional</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.addonScroll}
            contentContainerStyle={styles.addonScrollContent}
          >
            {freshHerbs.map(renderAddonCard)}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Add to Cart Bar */}
      <SafeAreaView style={styles.bottomBarContainer} edges={['bottom']}>
        <View style={styles.bottomBar}>
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#EF4444',
  },
  description: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 8,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDB022',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    marginBottom: 20,
  },
  discountIcon: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '700',
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#000000',
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  reviewScore: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    fontSize: 16,
    color: '#FDB022',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  featureChip: {
    backgroundColor: '#CFFCE3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    width: '48.5%',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: '#009D66',
    textAlign: 'center',
    numberOfLines: 1,
  },
  addonSection: {
    marginBottom: 20,
    paddingBottom: 20,
  },
  addonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  addonSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 4,
  },
  addonSectionSubtitle: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    color: '#64748B',
  },
  optionalBadge: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    color: '#009D66',
    backgroundColor: '#CFFCE3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addonScroll: {
    paddingLeft: 20,
  },
  addonScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  addonCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    position: 'relative',
    minHeight: 240,
  },
  addonDiscount: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FDB022',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  addonDiscountText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#000000',
  },
  addonImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  addonInfo: {
    marginBottom: 8,
  },
  addonName: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 4,
    numberOfLines: 1,
    minHeight: 20,
  },
  addonPrice: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#EF4444',
  },
  addonAddButton: {
    backgroundColor: '#026A49',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addonAddButtonText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#FFFFFF',
  },
});

export default ProductDetailScreen;
