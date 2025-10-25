import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ImageSourcePropType,
} 

from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import FilterModalScreen, { FilterState } from './FilterModalScreen';

const { width } = Dimensions.get('window');
const cardWidth = (width - 64 - 12) / 2; // 32px padding each side + 12px gap

type GroceryListNavigationProp = StackNavigationProp<RootStackParamList>;

interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  image: ImageSourcePropType;
  quantity: number;
  brand?: string;
  rating?: number;
  hasDiscount?: boolean;
  discountPercent?: number;
}

const GroceryListScreen: React.FC = () => {
  const navigation = useNavigation<GroceryListNavigationProp>();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: '',
    sortBy: '',
    discount: '',
    ratings: '',
    delivery: '',
    brandSeller: '',
    packaging: '',
    selectedBrands: [],
  });

  const [allGroceryItems] = useState<GroceryItem[]>([
    {
      id: '1',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices',
      price: '699',
      discount: '-23%',
      image: require('../images/homepage-assets/home-grocery1.png'),
      quantity: 1,
      brand: 'Arya Farms',
      rating: 4.5,
      hasDiscount: true,
      discountPercent: 23,
    },
    {
      id: '2',
      name: 'Family Bundle',
      description: 'Complete grocery pack with all essentials',
      price: '899',
      discount: '-15%',
      image: require('../images/homepage-assets/home-grocery2.png'),
      quantity: 1,
      brand: 'FreshMart',
      rating: 4.8,
      hasDiscount: true,
      discountPercent: 15,
    },
    {
      id: '3',
      name: 'Daily Essentials',
      description: 'Milk, bread, eggs, butter, cheese, yogurt',
      price: '599',
      discount: '-10%',
      image: require('../images/homepage-assets/home-grocery-list.png'),
      quantity: 1,
      brand: 'GreenLeaf',
      rating: 4.6,
      hasDiscount: true,
      discountPercent: 10,
    },
    {
      id: '4',
      name: 'Fresh Vegetables',
      description: 'Potatoes, onions, tomatoes, spinach, carrots',
      price: '399',
      discount: '-20%',
      image: require('../images/homepage-assets/home-grocery1.png'),
      quantity: 1,
      brand: 'Arya Farms',
      rating: 4.9,
      hasDiscount: true,
      discountPercent: 20,
    },
    {
      id: '5',
      name: 'Breakfast Pack',
      description: 'Cereals, oats, honey, jam, spreads',
      price: '499',
      discount: '-18%',
      image: require('../images/homepage-assets/home-grocery2.png'),
      quantity: 1,
      brand: 'SnackTime',
      rating: 4.3,
      hasDiscount: true,
      discountPercent: 18,
    },
    {
      id: '6',
      name: 'Snacks Bundle',
      description: 'Chips, biscuits, chocolates, nuts, drinks',
      price: '799',
      discount: '-12%',
      image: require('../images/homepage-assets/home-grocery-list.png'),
      quantity: 1,
      brand: 'FreshMart',
      rating: 4.7,
      hasDiscount: true,
      discountPercent: 12,
    },
    {
      id: '7',
      name: 'Cooking Essentials',
      description: 'Spices, salt, sauces, vinegar, cooking oil',
      price: '549',
      discount: '-25%',
      image: require('../images/homepage-assets/home-grocery1.png'),
      quantity: 1,
      brand: 'GreenLeaf',
      rating: 4.4,
      hasDiscount: true,
      discountPercent: 25,
    },
    {
      id: '8',
      name: 'Beverage Pack',
      description: 'Tea, coffee, juice, soft drinks, water',
      price: '649',
      discount: '-14%',
      image: require('../images/homepage-assets/home-grocery2.png'),
      quantity: 1,
      brand: 'Arya Farms',
      rating: 4.6,
      hasDiscount: true,
      discountPercent: 14,
    },
    {
      id: '9',
      name: 'Bakery Bundle',
      description: 'Bread, cakes, pastries, cookies, buns',
      price: '449',
      discount: '-16%',
      image: require('../images/homepage-assets/home-grocery-list.png'),
      quantity: 1,
      brand: 'SnackTime',
      rating: 4.2,
      hasDiscount: true,
      discountPercent: 16,
    },
    {
      id: '10',
      name: 'Meat & Protein',
      description: 'Chicken, beef, fish, eggs, lentils',
      price: '999',
      discount: '-8%',
      image: require('../images/homepage-assets/home-grocery1.png'),
      quantity: 1,
      brand: 'FreshMart',
      rating: 4.5,
      hasDiscount: true,
      discountPercent: 8,
    },
  ]);

  // State for managing individual item quantities
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(allGroceryItems);

  // Filter products based on active filters
  const getFilteredProducts = () => {
    let filtered = [...allGroceryItems];

    // Filter by selected brands
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && filters.selectedBrands.includes(product.brand)
      );
    }

    // Filter by discount
    if (filters.discount) {
      filtered = filtered.filter(product => product.hasDiscount);
    }

    // Filter by ratings
    if (filters.ratings) {
      const minRating = parseFloat(filters.ratings);
      filtered = filtered.filter(product =>
        product.rating && product.rating >= minRating
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = parseInt(product.price);
        const range = filters.priceRange;

        if (range.includes('Under')) {
          const max = parseInt(range.match(/\d+/)?.[0] || '0');
          return price < max;
        } else if (range.includes('Above')) {
          const min = parseInt(range.match(/\d+/)?.[0] || '0');
          return price > min;
        } else if (range.includes('-')) {
          const matches = range.match(/\d+/g);
          if (matches && matches.length === 2) {
            const min = parseInt(matches[0]);
            const max = parseInt(matches[1]);
            return price >= min && price <= max;
          }
        }
        return true;
      });
    }

    // Sort products
    if (filters.sortBy) {
      if (filters.sortBy.includes('Low to High')) {
        filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      } else if (filters.sortBy.includes('High to Low')) {
        filtered.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      } else if (filters.sortBy.includes('Rating')) {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    return filtered;
  };

  // Get filtered products
  const filteredProducts = getFilteredProducts();

  const handleQuantityChange = (id: string, change: number) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleAddToCart = (id: string) => {
    console.log(`Added item ${id} to cart`);
    // Navigate to cart or show confirmation
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item } as any)}
      activeOpacity={0.7}
    >
      {/* Discount Badge */}
      <View style={styles.discountLabel}>
        <Text style={styles.discountIcon}>⚡</Text>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>{item.price} PKR</Text>
      </View>

      {/* Actions */}
      <View style={styles.productActions}>
        {/* Quantity Selector */}
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={(e) => {
            e.stopPropagation();
            handleAddToCart(item.id);
          }}
        >
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#026A49" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grocery List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
          >
            <View style={styles.filterIconContainer}>
              <View style={styles.filterLine} />
              <View style={styles.filterLineMid} />
              <View style={styles.filterLine} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart' as any)}
          >
            <Text style={styles.cartIconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('HomescreenNew')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.navIconActive}>📊</Text>
          <Text style={styles.navLabelActive}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📈</Text>
          <Text style={styles.navLabel}>Sell/Ads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <FilterModalScreen
        visible={showFilterModal}
        onClose={closeFilterModal}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#026A49',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  filterLine: {
    width: 20,
    height: 2,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  filterLineMid: {
    width: 14,
    height: 2,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconText: {
    fontSize: 24,
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemCard: {
    width: cardWidth,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    padding: 10,
    position: 'relative',
  },
  discountLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FAB001',
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  discountIcon: {
    fontSize: 8,
    color: '#000',
  },
  discountText: {
    color: '#1E293B',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  imageContainer: {
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 6,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    gap: 2,
    marginBottom: 10,
  },
  productName: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  productDescription: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    lineHeight: 14,
  },
  productPrice: {
    color: '#EF5D21',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  quantityButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  quantityText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'DM Sans',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#026A49',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#CFCFCF',
    paddingHorizontal: 4,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  navIconActive: {
    color: '#026A49',
    fontSize: 20,
  },
  navIcon: {
    color: '#334155',
    fontSize: 20,
  },
  navLabelActive: {
    color: '#026A49',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  navLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
});

export default GroceryListScreen;