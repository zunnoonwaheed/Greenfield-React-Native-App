import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getProducts, searchProducts } from '../api/productAPI';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import type { MainStackParamList } from '../navigation/MainStack';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  image: any;
  category_name?: string;
  brand_name?: string;
}

type ProductListingRouteProp = RouteProp<MainStackParamList, 'ProductListing'>;

const ProductListingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductListingRouteProp>();
  const { categoryId, searchQuery } = route.params || {};

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Sale', 'Bundles', 'Brands ▾', 'Sort By'];

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // If search query is provided, use search API
      if (searchQuery) {
        console.log('🔍 Searching for:', searchQuery);
        response = await searchProducts(searchQuery);
      }
      // If category ID is provided, filter by category
      else if (categoryId) {
        console.log('📂 Fetching products for category:', categoryId);
        response = await getProducts({ category_id: categoryId, limit: 50 });
      }
      // Otherwise, get all products
      else {
        console.log('📦 Fetching all products');
        response = await getProducts({ limit: 50 });
      }

      console.log('📡 Products response:', response);

      // Response interceptor unwraps response.data
      // Handle both array response and object with data property
      const productData = Array.isArray(response)
        ? response
        : (response?.data?.products || response?.products || []);

      if (productData && productData.length > 0) {
        setProducts(productData.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.discounted_price || product.price),
          image: product.image_url
            ? { uri: product.image_url }
            : require('../images/homepage-assets/home-grocery1.png'),
          category_name: product.category_name,
          brand_name: product.brand_name,
          discount: product.discount_percentage,
        })));
        console.log('✅ Loaded', productData.length, 'products');
      } else {
        setProducts([]);
        console.log('⚠️ No products found');
      }
    } catch (err: any) {
      console.error('❌ Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, { productId: product.id } as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {searchQuery ? `Search: "${searchQuery}"` : categoryId ? 'Category Products' : 'All Products'}
        </Text>
        <TouchableOpacity>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product Grid - 2 columns */}
      {!loading && !error && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.card}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.7}
              >
                {product.discount && product.discount > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountIcon}>⚡</Text>
                    <Text style={styles.discountText}>-{product.discount}%</Text>
                  </View>
                )}
                <Image source={product.image} style={styles.productImage} resizeMode="cover" />
                <View style={styles.cardContent}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.gap,
    paddingTop: 50,
  },
  backIcon: {
    fontSize: Layout.iconSize,
    color: Colors.black,
  },
  headerTitle: {
    fontSize: Typography.h5,
    fontWeight: Typography.semibold,
    color: Colors.black,
  },
  filterIcon: {
    fontSize: Layout.iconSize,
    color: Colors.black,
  },
  filterContainer: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.gap,
  },
  filterChip: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.backgroundGray,
    marginRight: Spacing.small,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  filterTextActive: {
    color: Colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FAB001',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  discountIcon: {
    fontSize: 12,
    color: '#000',
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  cardContent: {
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#026A49',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.gap,
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  errorText: {
    fontSize: Typography.bodySmall,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.medium,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.gap,
    borderRadius: BorderRadius.button,
  },
  retryButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
  },
});

export default ProductListingScreen;