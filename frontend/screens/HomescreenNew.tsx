import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageSourcePropType,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import SavedAddressesScreen from './SavedAddressesScreen';
import AddNewAddressScreen from './AddNewAddressScreen';

// ============================================
// API IMPORTS - All integrated with PHP backend
// ============================================
import { getProducts } from '../api/getProducts';
import { getTopLevelCategories } from '../api/getCategories';
import { getFeaturedBundles } from '../api/getBundles';
import { getCartCount } from '../api/getCartCount';
import { getUnreadNotificationsCount } from '../api/getNotifications';
import { getUserAddress } from '../api/getUserAddress';
import { addBundleToCart } from '../api/addBundleToCart';

type HomescreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string | number;
  name: string;
  image: ImageSourcePropType;
  slug?: string;
}

interface BundleItem {
  id: string | number;
  name: string;
  description: string;
  original_price: string | number;
  discounted_price: string | number;
  discount_percentage?: number;
  image: ImageSourcePropType;
  products?: any[];
}

interface ProductItem {
  id: string | number;
  name: string;
  price: string | number;
  image_url?: string;
  category_id?: string | number;
}

const HomescreenNew: React.FC = () => {
  const navigation = useNavigation<HomescreenNavigationProp>();

  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);

  // Data states
  const [deliveryAddress, setDeliveryAddress] = useState('Loading...');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Bundle quantities for UI
  const [bundleQuantities, setBundleQuantities] = useState<{ [key: string]: number }>({});

  // Load all data on mount and when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadAllData();
      loadCartBadge();
      loadNotificationBadge();
    }, [])
  );

  // Refresh cart and notification badges periodically
  useEffect(() => {
    const interval = setInterval(() => {
      loadCartBadge();
      loadNotificationBadge();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * LOAD ALL HOMEPAGE DATA
   * Fetches categories, bundles, products, and user address from PHP backend
   */
  const loadAllData = async () => {
    setLoading(true);
    try {
      console.log('🏠 Loading homepage data from backend...');

      // Load all data in parallel for better performance
      const [categoriesRes, bundlesRes, productsRes] = await Promise.all([
        getTopLevelCategories().catch(err => {
          console.error('Error loading categories:', err);
          return { success: false, data: { categories: [] } };
        }),
        getFeaturedBundles(5).catch(err => {
          console.error('Error loading bundles:', err);
          return { success: false, data: { bundles: [] } };
        }),
        getProducts({ limit: 20 }).catch(err => {
          console.error('Error loading products:', err);
          return { success: false, data: { products: [] } };
        })
      ]);

      // Process categories
      if (categoriesRes.success && categoriesRes.data && categoriesRes.data.categories) {
        // Map category names to their correct images (in specific order)
        const categoryImageMap: { [key: string]: any } = {
          'Grocery Bundles': require('../images/homepage-assets/shop-cat1.png'),
          'Fresh Produce': require('../images/homepage-assets/shop-cat4.png'),
          'Dairy & Bakery': require('../images/homepage-assets/shop-cat3.png'),
          'Snacks & Beverages': require('../images/homepage-assets/shop-cat2.png'),
        };

        // Define the exact order and categories for homepage
        const mainCategoriesOrder = ['Grocery Bundles', 'Fresh Produce', 'Dairy & Bakery', 'Snacks & Beverages'];

        // Sort categories by the defined order
        const cats = mainCategoriesOrder
          .map(catName => {
            const cat = categoriesRes.data.categories.find((c: any) => c.name === catName);
            if (cat) {
              return {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                image: categoryImageMap[cat.name],
              };
            }
            return null;
          })
          .filter((cat): cat is NonNullable<typeof cat> => cat !== null);

        setCategories(cats);
        console.log('✅ Categories loaded:', cats.length);
      } else {
        // Fallback to default categories if backend fails
        setCategories([
          { id: '1', name: 'Grocery Bundles', image: require('../images/homepage-assets/shop-cat1.png') },
          { id: '2', name: 'Fresh Produce', image: require('../images/homepage-assets/shop-cat4.png') },
          { id: '3', name: 'Dairy & Bakery', image: require('../images/homepage-assets/shop-cat3.png') },
          { id: '4', name: 'Snacks & Beverages', image: require('../images/homepage-assets/shop-cat2.png') },
        ]);
      }

      // Process bundles
      if (bundlesRes.success && bundlesRes.data && bundlesRes.data.bundles) {
        const bdls = bundlesRes.data.bundles.map((bundle: any) => {
          const originalPrice = parseFloat(bundle.original_price) || 0;
          const discountedPrice = parseFloat(bundle.discounted_price) || 0;
          const discountPercentage = originalPrice > 0
            ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
            : 0;

          return {
            id: bundle.id,
            name: bundle.name || 'Bundle Offer',
            description: bundle.description || 'Special bundle offer',
            original_price: originalPrice,
            discounted_price: discountedPrice,
            discount_percentage: discountPercentage,
            products: bundle.products || [],
            // Use placeholder image - can be updated to use bundle.image_url if available
            image: require('../images/homepage-assets/grocery-bun.png'),
          };
        });
        setBundles(bdls);

        // Initialize quantities
        const initialQuantities: { [key: string]: number } = {};
        bdls.forEach((b: BundleItem) => {
          initialQuantities[b.id.toString()] = 1;
        });
        setBundleQuantities(initialQuantities);

        console.log('✅ Bundles loaded:', bdls.length);
      } else {
        // Fallback bundles - showing at least 2 cards
        setBundles([
          {
            id: '1',
            name: 'Weekly Essentials',
            description: 'Rice, flour, pulses, oil, tea, sugar, and spices',
            original_price: 899,
            discounted_price: 699,
            discount_percentage: 23,
            image: require('../images/homepage-assets/grocery-bun.png'),
          },
          {
            id: '2',
            name: 'Fresh Produce Pack',
            description: 'Fresh fruits, vegetables, and dairy products',
            original_price: 1299,
            discounted_price: 999,
            discount_percentage: 23,
            image: require('../images/homepage-assets/grocery-bun.png'),
          }
        ]);
        setBundleQuantities({ '1': 1, '2': 1 });
      }

      // Process products
      if (productsRes.success && productsRes.data && productsRes.data.products) {
        setProducts(productsRes.data.products);
        console.log('✅ Products loaded:', productsRes.data.products.length);
      }

      // Load user address
      await loadDefaultAddress();

    } catch (error) {
      console.error('❌ Error loading homepage data:', error);
      Alert.alert('Error', 'Failed to load homepage data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOAD USER'S DEFAULT DELIVERY ADDRESS
   */
  const loadDefaultAddress = async () => {
    try {
      const response = await getUserAddress();
      if (response.success && response.data && response.data.user) {
        const address = response.data.user.address || 'Set delivery address';
        setDeliveryAddress(address);
        console.log('✅ Address loaded:', address);
      } else {
        setDeliveryAddress('Set delivery address');
      }
    } catch (error) {
      console.error('Error loading address:', error);
      setDeliveryAddress('Sky Avenue'); // Fallback
    }
  };

  /**
   * LOAD CART BADGE COUNT
   */
  const loadCartBadge = async () => {
    try {
      const count = await getCartCount();
      setCartItemCount(count);
      console.log('🛒 Cart count:', count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemCount(0);
    }
  };

  /**
   * LOAD NOTIFICATION BADGE COUNT
   */
  const loadNotificationBadge = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setNotificationCount(count);
      console.log('🔔 Notification count:', count);
    } catch (error) {
      console.error('Error loading notification count:', error);
      setNotificationCount(0);
    }
  };

  /**
   * HANDLE ADD BUNDLE TO CART
   */
  const handleAddBundleToCart = async (bundle: BundleItem) => {
    try {
      const quantity = bundleQuantities[bundle.id.toString()] || 1;
      console.log(`📦 Adding bundle ${bundle.id} to cart (qty: ${quantity})`);

      await addBundleToCart({ bundle_id: bundle.id });

      Alert.alert(
        'Success',
        `${bundle.name} added to cart!`,
        [{ text: 'OK', onPress: () => loadCartBadge() }]
      );
    } catch (error: any) {
      console.error('Error adding bundle to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add bundle to cart');
    }
  };

  /**
   * UPDATE BUNDLE QUANTITY
   */
  const updateBundleQuantity = (bundleId: string | number, delta: number) => {
    setBundleQuantities(prev => {
      const currentQty = prev[bundleId.toString()] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return {
        ...prev,
        [bundleId.toString()]: newQty
      };
    });
  };

  // Address modal handlers
  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    loadDefaultAddress();
  };

  const handleAddNewAddress = () => {
    console.log('handleAddNewAddress called in HomescreenNew');
    setShowAddressModal(false);
    setTimeout(() => {
      console.log('Opening AddNewAddressScreen');
      setShowAddNewAddress(true);
    }, 300);
  };

  const handleAddNewAddressClose = () => {
    setShowAddNewAddress(false);
    setTimeout(() => {
      setShowAddressModal(true);
    }, 300);
  };

  const handleAddressAdded = () => {
    loadDefaultAddress();
    setShowAddNewAddress(false);
  };

  /**
   * RENDER CATEGORY ITEM
   */
  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => navigation.navigate('GroceryList')}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  /**
   * RENDER BUNDLE ITEM
   */
  const renderBundleItem = (item: BundleItem) => {
    const quantity = bundleQuantities[item.id.toString()] || 1;
    const discountText = item.discount_percentage
      ? `-${item.discount_percentage}%`
      : '-23%';
    const priceText = typeof item.discounted_price === 'number'
      ? `Rs. ${item.discounted_price}`
      : `Rs. ${item.discounted_price}`;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.bundleCard}
        onPress={() => navigation.navigate('ProductDetail' as any)}
      >
        <View style={styles.discountLabel}>
          <Text style={styles.discountIcon}>⚡</Text>
          <Text style={styles.discountText}>{discountText}</Text>
        </View>
        <View style={styles.bundleImageContainer}>
          <Image source={item.image} style={styles.bundleImage} resizeMode="cover" />
        </View>
        <View style={styles.bundleContent}>
          <View style={styles.bundleInfo}>
            <Text style={styles.bundleName}>{item.name}</Text>
            <Text style={styles.bundleDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.bundlePrice}>{priceText}</Text>
          </View>
          <View style={styles.bundleActions}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateBundleQuantity(item.id, -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateBundleQuantity(item.id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddBundleToCart(item)}
            >
              <Text style={styles.addToCartText} numberOfLines={1}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />

      {/* Header Section with Background Image */}
      <View style={styles.headerWrapper}>
        <Image
          source={require('../images/homepage-assets/bg-home.png')}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.header}>
          <View style={styles.topBar}>
            {/* Bell Icon for Notifications */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Image
                source={require('../images/homepage-assets/Notification.png')}
                style={styles.headerIcon}
                resizeMode="contain"
              />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Cart Icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart' as any)}
            >
              <Image
                source={require('../images/homepage-assets/cart.png')}
                style={styles.headerIcon}
                resizeMode="contain"
              />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() => setShowAddressModal(true)}
              activeOpacity={0.7}
            >
              <Image
                source={require('../images/homepage-assets/deliver-avenue.png')}
                style={styles.deliverAvenueImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Text style={styles.searchPlaceholder}>Start Shopping</Text>
              <Image
                source={require('../images/homepage-assets/mic.png')}
                style={styles.micIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Banner Section */}
          <View style={styles.bannerSection}>
            <Image
              source={require('../images/homepage-assets/home-banner.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* Shop by Category */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map(renderCategoryItem)}
            </ScrollView>
          </View>

          {/* Popular Grocery Bundles */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => navigation.navigate('GroceryList')}
            >
              <Text style={styles.sectionTitle}>Popular Grocery Bundles</Text>
              <Text style={styles.chevronRight}>›</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.bundlesContainer}
            >
              {bundles.map(renderBundleItem)}
            </ScrollView>
          </View>

          {/* Grocery List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Grocery List</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.listsContainer}
            >
              <TouchableOpacity style={styles.createListCard}>
                <View style={styles.createListIcon}>
                  <Text style={styles.plusIcon}>+</Text>
                </View>
                <Text style={styles.createListTitle}>Create List</Text>
                <Text style={styles.createListSubtitle}>Type, capture or gallery upload</Text>
              </TouchableOpacity>

              <View style={styles.listCard}>
                <View style={styles.listImageContainer}>
                  <Image
                    source={require('../images/homepage-assets/grocery-list-cart.png')}
                    style={styles.listImageIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.listTitle}>List No 3</Text>
                <Text style={styles.listItems}>Rice, Spice, Fish, Meat</Text>
                <TouchableOpacity style={styles.addItemsButton}>
                  <Text style={styles.addItemsText}>Add Items</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.listCard}>
                <View style={styles.listImageContainer}>
                  <Image
                    source={require('../images/homepage-assets/grocery-list-cart.png')}
                    style={styles.listImageIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.listTitle}>List No 4</Text>
                <Text style={styles.listItems}>Rice, Spice, Fish, Meat</Text>
                <TouchableOpacity style={styles.addItemsButton}>
                  <Text style={styles.addItemsText}>Add Items</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      )}

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => {
          console.log('Opening Messages screen');
          navigation.navigate('Messages');
        }}
        activeOpacity={0.8}
      >
        <Image
          source={require('../images/homepage-assets/message-circle.png')}
          style={styles.chatbotIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Address Modals - Layered correctly */}
      {showAddressModal && (
        <SavedAddressesScreen
          visible={showAddressModal}
          onClose={handleAddressModalClose}
          onAddNewAddress={handleAddNewAddress}
        />
      )}

      {showAddNewAddress && (
        <AddNewAddressScreen
          visible={showAddNewAddress}
          onClose={handleAddNewAddressClose}
          onAddressAdded={handleAddressAdded}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  headerWrapper: {
    position: 'relative',
  },
  headerBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 200,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerIcon: {
    width: 36,
    height: 36,
    tintColor: '#FFFFFF',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#059669',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#059669',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  headerContent: {
    gap: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  deliverAvenueImage: {
    width: 200,
    height: 24,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPlaceholder: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    marginTop: -2,
  },
  micIcon: {
    width: 20,
    height: 20,
    tintColor: '#94A3B8'
  },

  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerImage: {
    width: '100%',
    height: 165,
    borderRadius: 12,
  },
  section: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  chevronRight: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '300',
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    gap: 8,
    width: 86,
  },
  categoryImageContainer: {
    width: 86,
    height: 86,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 86,
    height: 86,
  },
  categoryText: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    maxWidth: 86,
    lineHeight: 18,
  },
  bundlesContainer: {
    paddingLeft: 16,
  },
  bundleCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginRight: 12,
  },
  discountLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FDB022',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  discountIcon: {
    fontSize: 10,
    color: '#000000',
  },
  discountText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bundleContent: {
    padding: 10,
    gap: 10,
  },
  bundleImageContainer: {
    height: 130,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  bundleImage: {
    width: '100%',
    height: '100%',
  },
  bundleInfo: { gap: 4 },
  bundleName: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  bundleDescription: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    lineHeight: 16,
  },
  bundlePrice: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    marginTop: 4,
  },
  bundleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 8,
  },
  quantityButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    minWidth: 12,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#026A49',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    flexShrink: 1,
  },
  listsContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  createListCard: {
    width: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    minHeight: 200,
  },
  createListIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#009D66',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
  createListTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  createListSubtitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    lineHeight: 18,
  },
  listCard: {
    width: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
    padding: 12,
    gap: 8,
  },
  listImageContainer: {
    height: 100,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listImageIcon: {
    width: '100%',
    height: '100%',
  },
  listTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  listItems: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  addItemsButton: {
    backgroundColor: '#A3F7CD',
    borderRadius: 6,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemsText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },

  chatbotButton: {
    position: 'absolute',
    right: 20,
    bottom: 95,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 999,
  },
  chatbotIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF'
  },
});

export default HomescreenNew;
