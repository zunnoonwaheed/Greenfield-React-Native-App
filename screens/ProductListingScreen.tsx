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

      if (response.success && response.data) {
        setProducts(response.data.map((product: any) => ({
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
          <ActivityIndicator size="large" color="#059669" />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  filterIcon: {
    fontSize: 24,
    color: '#000',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#059669',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F97316',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'column',
    gap: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 4,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#059669',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductListingScreen;