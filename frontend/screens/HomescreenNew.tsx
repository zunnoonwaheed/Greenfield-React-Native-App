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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import SavedAddressesScreen from './SavedAddressesScreen';
import AddNewAddressScreen from './AddNewAddressScreen';
import ChatbotModal from './ChatbotModal';

// ============================================
// API IMPORTS - All integrated with PHP backend
// ============================================
import { getProducts } from '../api/getProducts';
import { getBestSellingProducts } from '../api/productAPI';
import { getTopLevelCategories } from '../api/getCategories';
import { getCartCount } from '../api/getCartCount';
import { getUnreadNotificationsCount } from '../api/getNotifications';
import { getUserAddress } from '../api/getUserAddress';
import { addToCart } from '../api/addToCart';

type HomescreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string | number;
  name: string;
  image: ImageSourcePropType;
  slug?: string;
}

interface ProductItem {
  id: string | number;
  name: string;
  price: string | number;
  discounted_price?: string | number;
  image_url?: string;
  category_id?: string | number;
}

const HomescreenNew: React.FC = () => {
  const navigation = useNavigation<HomescreenNavigationProp>();

  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Data states
  const [deliveryAddress, setDeliveryAddress] = useState('Loading...');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Product quantities for UI (for best-selling products)
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

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
      const [categoriesRes, bestSellingRes] = await Promise.all([
        getTopLevelCategories().catch(err => {
          console.error('Error loading categories:', err);
          return { success: false, data: { categories: [] } };
        }),
        getBestSellingProducts(20).catch(err => {
          console.error('Error loading best-selling products:', err);
          return { success: false, data: { products: [] } };
        })
      ]);

      // Process categories - Show ALL categories from database
      if (categoriesRes.success && categoriesRes.data && categoriesRes.data.categories) {
        // Map ALL database categories (no limit - show all)
        const cats = categoriesRes.data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          // Use real category image from database (same as web app)
          image: cat.image_url ? { uri: cat.image_url } : require('../images/homepage-assets/shop-cat1.png'),
        }));

        setCategories(cats);
        console.log('✅ Categories loaded from database:', cats.length);
      } else {
        // Show empty if backend fails - don't use hardcoded data
        setCategories([]);
        console.warn('⚠️ Failed to load categories from backend');
      }

      // Process best-selling products
      if (bestSellingRes.success && bestSellingRes.data && bestSellingRes.data.products) {
        const products = bestSellingRes.data.products;
        setBestSellingProducts(products);

        // Initialize quantities for products
        const initialQuantities: { [key: string]: number } = {};
        products.forEach((product: ProductItem) => {
          initialQuantities[product.id.toString()] = 1;
        });
        setProductQuantities(initialQuantities);

        console.log('✅ Best-selling products loaded:', products.length);
      } else {
        setBestSellingProducts([]);
        console.warn('⚠️ Failed to load best-selling products');
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
      console.log('📍 Loading user address from backend...');
      const response = await getUserAddress();

      if (response.success && response.data && response.data.user) {
        const userAddress = response.data.user.address;

        if (userAddress && userAddress.trim() !== '') {
          setDeliveryAddress(userAddress);
          console.log('✅ Address loaded from backend:', userAddress);
        } else {
          setDeliveryAddress('Set delivery address');
          console.log('⚠️ No address set for user');
        }
      } else {
        setDeliveryAddress('Set delivery address');
        console.log('⚠️ No user data returned');
      }
    } catch (error) {
      console.error('❌ Error loading address:', error);
      setDeliveryAddress('Set delivery address'); // Changed fallback
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
   * HANDLE SEARCH
   */
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('🔍 Searching for:', searchQuery);
      navigation.navigate('ProductListing', { searchQuery: searchQuery.trim() });
    }
  };

  /**
   * HANDLE ADD PRODUCT TO CART
   */
  const handleAddProductToCart = async (product: ProductItem) => {
    try {
      const quantity = productQuantities[product.id.toString()] || 1;
      console.log(`📦 Adding product ${product.id} to cart (qty: ${quantity})`);

      await addToCart({
        product_id: product.id,
        quantity: quantity,
        price: product.price
      });

      Alert.alert(
        'Success',
        `${product.name} added to cart!`,
        [{ text: 'OK', onPress: () => loadCartBadge() }]
      );
    } catch (error: any) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add product to cart');
    }
  };

  /**
   * UPDATE PRODUCT QUANTITY
   */
  const updateProductQuantity = (productId: string | number, delta: number) => {
    setProductQuantities(prev => {
      const currentQty = prev[productId.toString()] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return {
        ...prev,
        [productId.toString()]: newQty
      };
    });
  };

  // Handle address selection from SavedAddressesScreen
  const handleSelectAddress = (address: { id: string; name: string; address: string }) => {
    console.log('📍 Address selected:', address);
    // Update navbar immediately with selected address
    const fullAddress = `${address.name}, ${address.address}`;
    setDeliveryAddress(fullAddress);
  };

  // Address modal handlers
  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    // Reload from backend to ensure sync
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
    console.log('🏠 Address added - reloading address...');
    setShowAddNewAddress(false);
    // Reload address after a short delay to ensure backend has updated
    setTimeout(() => {
      loadDefaultAddress();
    }, 500);
  };

  /**
   * RENDER CATEGORY ITEM
   */
  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => {
        // Navigate to GroceryList with category filter
        navigation.navigate('GroceryList', { categoryId: item.id } as any);
      }}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <Text style={styles.categoryText} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  /**
   * RENDER BEST-SELLING PRODUCT ITEM (Bundle Card Design)
   */
  const renderBestSellingProduct = (item: ProductItem) => {
    const productImage = item.image_url
      ? { uri: item.image_url }
      : require('../images/homepage-assets/shop-cat1.png');

    const quantity = productQuantities[item.id.toString()] || 1;

    // Calculate discount percentage
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price as string);
    const discountedPrice = item.discounted_price
      ? (typeof item.discounted_price === 'number' ? item.discounted_price : parseFloat(item.discounted_price as string))
      : price;
    const discountPercentage = price > 0 && discountedPrice < price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

    const discountText = discountPercentage > 0 ? `-${discountPercentage}%` : '';
    const displayPrice = discountedPrice > 0 && discountedPrice < price ? discountedPrice : price;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.bundleCard}
        onPress={() => {
          // Navigate to product detail screen
          navigation.navigate('ProductDetail', { productId: item.id });
        }}
      >
        {discountPercentage > 0 && (
          <View style={styles.discountLabel}>
            <Text style={styles.discountIcon}>⚡</Text>
            <Text style={styles.discountText}>{discountText}</Text>
          </View>
        )}
        <View style={styles.bundleImageContainer}>
          <Image source={productImage} style={styles.bundleImage} resizeMode="cover" />
        </View>
        <View style={styles.bundleContent}>
          <View style={styles.bundleInfo}>
            <Text style={styles.bundleName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.bundlePrice}>Rs. {displayPrice}</Text>
          </View>
          <View style={styles.bundleActions}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateProductQuantity(item.id, -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateProductQuantity(item.id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleAddProductToCart(item)}
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
              {/* Dynamic address display - matches deliver-avenue.png design */}
              <View style={styles.deliverToContainer}>
                <View style={styles.deliverToRow}>
                  <Text style={styles.deliverToText} numberOfLines={1}>
                    Deliver to{' '}
                    <Text style={styles.addressHighlight}>
                      {deliveryAddress.length > 20
                        ? deliveryAddress.substring(0, 20) + '...'
                        : deliveryAddress}
                    </Text>
                  </Text>
                  <Text style={styles.deliverToArrow}>⌄</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <Image
                source={require('../images/homepage-assets/search.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for products..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleSearch}>
                <Image
                  source={require('../images/homepage-assets/mic.png')}
                  style={styles.micIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
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

          {/* Categories Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => navigation.navigate('Categories')}
            >
              <Text style={styles.sectionTitle}>Categories</Text>
              <Text style={styles.chevronRight}>›</Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map(renderCategoryItem)}
            </ScrollView>
          </View>

          {/* Best Selling Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Best Selling Products</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.bundlesContainer}
            >
              {bestSellingProducts.map(renderBestSellingProduct)}
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
          console.log('Opening Chatbot modal');
          setShowChatbot(true);
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
          onSelectAddress={handleSelectAddress}
        />
      )}

      {showAddNewAddress && (
        <AddNewAddressScreen
          visible={showAddNewAddress}
          onClose={handleAddNewAddressClose}
          onAddressAdded={handleAddressAdded}
        />
      )}

      {/* Chatbot Modal */}
      <ChatbotModal
        visible={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
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
  deliverToContainer: {
    marginBottom: 12,
  },
  deliverToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
  },
  deliverToText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'DM Sans',
    flexShrink: 1,
  },
  addressHighlight: {
    fontWeight: '700',
    fontSize: 15,
  },
  deliverToArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: -3,
    fontWeight: '400',
    flexShrink: 0,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    paddingVertical: 0,
    fontFamily: 'DM Sans',
  },
  clearButton: {
    fontSize: 18,
    color: '#94A3B8',
    paddingHorizontal: 4,
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
