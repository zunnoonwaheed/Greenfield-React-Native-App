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
import { useNavigation } from '@react-navigation/native';
import { getAllProducts, searchProducts } from '../api/productAPI';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

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

const ProductListingScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Sale', 'Bundles', 'Brands ▾', 'Sort By'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProducts({ limit: 50 });

      // Response interceptor unwraps response.data
      // Handle both array response and object with data property
      const productData = Array.isArray(response) ? response : (response?.data || response?.products || []);
      if (productData && productData.length > 0) {
        setProducts(productData.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price),
          image: product.image || require('../images/homepage-assets/home-grocery1.png'),
          category_name: product.category_name,
          brand_name: product.brand_name,
          discount: product.discount_percentage,
        })));
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, { product } as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Searched Vegetables</Text>
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

      {/* Product Grid */}
      {!loading && !error && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {products.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.card}
              onPress={() => handleProductPress(product)}
            >
              {product.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>%-{product.discount}</Text>
                </View>
              )}
              <Image source={product.image} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription} numberOfLines={1}>
                {product.description}
              </Text>
              <Text style={styles.productPrice}>{product.price} Rs</Text>
              
              <View style={styles.actionRow}>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(product.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {quantities[product.id] || 1}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(product.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add To Cart</Text>
                </TouchableOpacity>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.screenPadding,
  },
  card: {
    width: cardWidth,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.card,
    padding: Spacing.gap,
    marginRight: Spacing.medium,
    marginBottom: Spacing.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.small,
    left: Spacing.small,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    zIndex: 1,
  },
  discountText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.black,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.small,
  },
  productName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  productDescription: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
  },
  productPrice: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.accent,
    marginBottom: Spacing.gap,
  },
  actionRow: {
    flexDirection: 'column',
    gap: Spacing.small,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.small,
    paddingVertical: Spacing.xs,
  },
  quantityButton: {
    paddingHorizontal: Spacing.gap,
    paddingVertical: Spacing.xs,
  },
  quantityButtonText: {
    fontSize: Typography.h5,
    color: Colors.textSecondary,
  },
  quantityText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    color: Colors.black,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
    paddingVertical: Spacing.small,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: Typography.semibold,
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