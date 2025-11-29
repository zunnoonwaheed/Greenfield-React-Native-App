import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { getProductById } from '../api/getProduct';
import { addToCart } from '../api/addToCart';
import { getCartCount } from '../api/getCartCount';

const { width } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<MainStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = StackNavigationProp<MainStackParamList, 'ProductDetail'>;

interface AddonProduct {
  id: string;
  name: string;
  price: string;
  image: any;
  discount: string;
}

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product details
  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      console.log('📦 Loading product details for ID:', productId);
      const response = await getProductById(productId);

      if (response.success && response.data && response.data.product) {
        setProduct(response.data.product);
        setSimilarProducts(response.data.similar_products || []);
        setFrequentlyBought(response.data.frequently_bought_together || []);
        setRecommended(response.data.recommended_for_you || []);
        console.log('✅ Product loaded:', response.data.product.name);
        console.log('✅ Similar products loaded:', response.data.similar_products?.length || 0);
        console.log('✅ Frequently bought together loaded:', response.data.frequently_bought_together?.length || 0);
        console.log('✅ Recommended loaded:', response.data.recommended_for_you?.length || 0);
      } else {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('❌ Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      console.log(`📦 Adding product ${productId} to cart (qty: ${quantity})`);

      await addToCart({
        product_id: productId,
        quantity: quantity,
        price: product.discounted_price || product.price
      });

      Alert.alert(
        'Success',
        `${product.name} added to cart!`,
        [
          { text: 'Continue Shopping', onPress: () => navigation.goBack() },
          { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
        ]
      );
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };


  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddAddonToCart = async (addonProduct: any) => {
    try {
      console.log(`📦 Adding addon product ${addonProduct.id} to cart`);

      const price = addonProduct.discounted_price && addonProduct.discounted_price < addonProduct.price
        ? addonProduct.discounted_price
        : addonProduct.price;

      await addToCart({
        product_id: addonProduct.id,
        quantity: 1,
        price: price
      });

      Alert.alert('Success', `${addonProduct.name} added to cart!`);
    } catch (error: any) {
      console.error('Error adding addon to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add to cart');
    }
  };

  const renderAddonCard = (item: any) => {
    const addonImage = item.image_url
      ? { uri: item.image_url }
      : require('../images/homepage-assets/shop-cat1.png');

    const displayPrice = item.discounted_price && item.discounted_price < item.price
      ? item.discounted_price
      : item.price;

    const hasDiscount = item.discount_percentage > 0;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.addonCard}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id.toString() })}
        activeOpacity={0.7}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.addonDiscount}>
            <Text style={styles.discountIcon}>⚡︎</Text>
            <Text style={styles.addonDiscountText}>-{item.discount_percentage}%</Text>
          </View>
        )}

        {/* Product Image */}
        <Image source={addonImage} style={styles.addonImage} resizeMode="cover" />

        {/* Product Info */}
        <View style={styles.addonInfo}>
          <Text style={styles.addonName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.addonPrice}>Rs. {displayPrice}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addonAddButton}
          onPress={(e) => {
            e.stopPropagation();
            handleAddAddonToCart(item);
          }}
        >
          <Text style={styles.addonAddButtonText}>Add To Cart</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backToHomeButton}>
          <Text style={styles.backToHomeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const productImage = product.image_url
    ? { uri: product.image_url }
    : require('../images/homepage-assets/shop-cat1.png');

  const displayPrice = product.discounted_price && product.discounted_price < product.price
    ? product.discounted_price
    : product.price;

  const hasDiscount = product.discount_percentage > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={productImage}
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
              <Text style={styles.productTitle}>{product.name}</Text>
            </View>
            <Text style={styles.productPrice}>Rs. {displayPrice}</Text>
          </View>

          {/* Description */}
          {product.description && (
            <Text style={styles.description}>
              {product.description}
            </Text>
          )}

          {/* Discount */}
          {hasDiscount && (
            <>
              <Text style={styles.sectionTitle}>Discount</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountIcon}>⚡︎</Text>
                <Text style={styles.discountBadgeText}>-{product.discount_percentage}%</Text>
              </View>
            </>
          )}

          {/* Reviews */}
          {product.rating && (
            <>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewScore}>{product.rating}/5.0</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={[styles.starIcon, star <= Math.round(product.rating) ? styles.starFilled : styles.starEmpty]}>★</Text>
                  ))}
                </View>
                {product.rating_count > 0 && (
                  <Text style={styles.reviewCount}>({product.rating_count} reviews)</Text>
                )}
              </View>
            </>
          )}

          {/* Brand */}
          {product.brand_name && (
            <>
              <Text style={styles.sectionTitle}>Brand</Text>
              <View style={styles.featureChip}>
                <Text style={styles.featureText}>{product.brand_name}</Text>
              </View>
            </>
          )}

        </View>

        {/* Similar Products (Same Category) */}
        {similarProducts.length > 0 && (
          <View style={styles.addonSection}>
            <View style={styles.addonHeader}>
              <View>
                <Text style={styles.addonSectionTitle}>You May Also Like</Text>
                <Text style={styles.addonSectionSubtitle}>From the Same Category</Text>
              </View>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.addonScroll}
              contentContainerStyle={styles.addonScrollContent}
            >
              {similarProducts.map(renderAddonCard)}
            </ScrollView>
          </View>
        )}

        {/* Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <View style={styles.addonSection}>
            <View style={styles.addonHeader}>
              <View>
                <Text style={styles.addonSectionTitle}>Frequently Bought Together</Text>
                <Text style={styles.addonSectionSubtitle}>Customers Often Add These Items</Text>
              </View>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.addonScroll}
              contentContainerStyle={styles.addonScrollContent}
            >
              {frequentlyBought.map(renderAddonCard)}
            </ScrollView>
          </View>
        )}

        {/* Recommended For You */}
        {recommended.length > 0 && (
          <View style={styles.addonSection}>
            <View style={styles.addonHeader}>
              <View>
                <Text style={styles.addonSectionTitle}>Recommended For You</Text>
                <Text style={styles.addonSectionSubtitle}>Based on Your Browsing</Text>
              </View>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.addonScroll}
              contentContainerStyle={styles.addonScrollContent}
            >
              {recommended.map(renderAddonCard)}
            </ScrollView>
          </View>
        )}

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
        <TouchableOpacity
          style={[styles.addToCartButton, addingToCart && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addToCartText}>Add To Cart</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontFamily: 'DM Sans',
    marginBottom: 16,
  },
  backToHomeButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  starFilled: {
    color: '#FDB022',
  },
  starEmpty: {
    color: '#E2E8F0',
  },
  reviewCount: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    fontFamily: 'DM Sans',
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
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
