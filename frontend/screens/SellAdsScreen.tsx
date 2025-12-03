/**
 * SellAdsScreen - Pixel-Perfect Marketplace Listing
 * Matches Figma design exactly
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getAds, searchAds } from '../api/marketplaceAPI';
import { API_BASE_URL } from '../api/axiosConfig';

type SellAdsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Local image mapping for database image paths
const LOCAL_IMAGES: { [key: string]: any } = {
  'sell/sell1.png': require('../images/sell/sell1.png'),
  'sell/sell2.png': require('../images/sell/sell2.png'),
  'sell/sell3.png': require('../images/sell/sell3.png'),
  'sell/sell4.png': require('../images/sell/sell4.png'),
  'sell/sell5.png': require('../images/sell/sell5.png'),
  'sell/sell6.png': require('../images/sell/sell6.png'),
};

// Default avatar for sellers
const DEFAULT_AVATAR = require('../images/homepage-assets/Avatar.png');

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: any;
  category: string;
  location: string;
  condition: 'New' | 'Used';
  specifications: string[];
  seller: {
    name: string;
    phone?: string;
    email?: string;
    image: any;
    datePosted: string;
  };
  rawData?: any;
}

// Helper function to get image source from database path or URI
const getImageSource = (imagePath: string | null): any => {
  if (!imagePath) {
    return require('../images/sell/sell1.png'); // Default fallback
  }
  // Check if it's a local image path from database (matching frontend assets)
  if (LOCAL_IMAGES[imagePath]) {
    return LOCAL_IMAGES[imagePath];
  }
  // Check if it's a full URL (for uploaded images)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return { uri: imagePath };
  }
  // Check if it's a local file URI (for newly uploaded images)
  if (imagePath.startsWith('file://')) {
    return { uri: imagePath };
  }
  // Check if it's a relative server path (uploads/ads/...)
  if (imagePath.startsWith('uploads/')) {
    return { uri: `${API_BASE_URL}/${imagePath}` };
  }
  // Default fallback
  return require('../images/sell/sell1.png');
};

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Helper to truncate description
const truncateDescription = (desc: string, maxLength: number = 25): string => {
  if (desc.length <= maxLength) return desc;
  return desc.substring(0, maxLength) + '...';
};

const SellAdsScreen: React.FC = () => {
  const navigation = useNavigation<SellAdsScreenNavigationProp>();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch ads from backend
  const fetchAds = async (search?: string) => {
    try {
      console.log('🔍 [SellAds] Fetching ads...');
      let result;
      if (search && search.trim()) {
        result = await searchAds(search);
      } else {
        result = await getAds();
      }

      console.log('📦 [SellAds] API Result:', JSON.stringify(result, null, 2));

      if (result.success && result.data?.ads) {
        console.log(`✅ [SellAds] Found ${result.data.ads.length} ads`);

        // Transform backend data to match frontend Product interface
        const transformedProducts: Product[] = result.data.ads.map((ad: any) => {
          console.log(`🔄 [SellAds] Transforming ad: ${ad.title}`);
          console.log(`   📞 Seller: ${ad.seller?.name}, Phone: ${ad.seller?.phone}`);
          return {
            id: String(ad.id),
            title: ad.title,
            description: truncateDescription(ad.description),
            fullDescription: ad.description, // Keep full description for detail screen
            price: ad.price,
            image: getImageSource(ad.primary_image),
            category: ad.subcategory ? `${ad.category}, ${ad.subcategory}` : ad.category,
            location: ad.location || 'Unknown Location',
            condition: ad.condition as 'New' | 'Used',
            specifications: ad.specifications || [],
            images: ad.total_images || 1, // Number of images for the ad
            seller: {
              name: ad.seller?.name || 'Unknown Seller',
              phone: ad.seller?.phone || '',
              email: ad.seller?.email || '',
              image: DEFAULT_AVATAR,
              datePosted: formatDate(ad.created_at),
            },
            // Keep raw data for detail screen
            rawData: ad,
          };
        });

        console.log(`✅ [SellAds] Transformed ${transformedProducts.length} products`);
        setProducts(transformedProducts);
      } else {
        console.log('⚠️ [SellAds] No ads in result or result not successful');
        console.log('Result success:', result.success);
        console.log('Result data:', result.data);
      }
    } catch (error) {
      console.error('❌ [SellAds] Error fetching ads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch ads when screen comes into focus (to refresh after creating new ad)
  useFocusEffect(
    useCallback(() => {
      fetchAds();
    }, [])
  );

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAds();
  };

  const handleAddNewAd = () => {
    navigation.navigate('CreateAdFlow');
  };

  const handleSearch = () => {
    setShowSearchModal(true);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('MarketplaceProductDetail', { product });
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productContent}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>PKR {item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={handleAddNewAd}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.addButton}
          >
            <Image
              source={require('../images/homepage-assets/plus.png')}
              style={styles.plusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <Image
              source={require('../images/homepage-assets/search.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Sell/Ads</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading ads...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#059669']}
              tintColor="#059669"
            />
          }
        >
          <View style={styles.productsContainer}>
            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No ads found</Text>
                <Text style={styles.emptySubtext}>Pull down to refresh or create a new ad</Text>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
                contentContainerStyle={styles.flatListContent}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="trending-up" size={24} color="#059669" />
          <Text style={[styles.navText, styles.navTextActive]}>Sell/Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.searchModalContent}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search Products</Text>
              <TouchableOpacity
                onPress={() => setShowSearchModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for products..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            <TouchableOpacity
              style={styles.searchSubmitButton}
              onPress={() => {
                setShowSearchModal(false);
                setLoading(true);
                fetchAds(searchQuery);
              }}
            >
              <Text style={styles.searchSubmitButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 28,
    height: 28,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 28,
    height: 28,
    tintColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
  },
  productContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  productDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontFamily: 'DM Sans',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    fontFamily: 'DM Sans',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
  },
  navItemActive: {},
  navText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: '#64748B',
  },
  navTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  searchModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 12,
    padding: 0,
    fontFamily: 'DM Sans',
  },
  searchSubmitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSubmitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default SellAdsScreen;