import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');
const cardWidth = (width - 64) / 2; // 32px padding on each side + 12px gap

type GroceryScreenNavigationProp = StackNavigationProp<any, any>;

interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  hasDiscount?: boolean;
  discountPercent?: number;
  quantity: number;
}

const GroceryScreen: React.FC = () => {
  const navigation = useNavigation<GroceryScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [products] = useState<ProductItem[]>([
    {
      id: 1,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      quantity: 1,
    },
    {
      id: 2,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      hasDiscount: true,
      discountPercent: 23,
      quantity: 1,
    },
    {
      id: 3,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      hasDiscount: true,
      discountPercent: 23,
      quantity: 1,
    },
    {
      id: 4,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      quantity: 1,
    },
    {
      id: 5,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      hasDiscount: true,
      discountPercent: 23,
      quantity: 1,
    },
    {
      id: 6,
      title: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/a98171bcec580aa2ea282b0bad06482c03157cf8',
      hasDiscount: true,
      discountPercent: 23,
      quantity: 1,
    },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleQuantityChange = (productId: number, change: number) => {
    // Handle quantity change logic here
    console.log(`Product ${productId} quantity changed by ${change}`);
  };

  const handleAddToCart = (productId: number) => {
    // Handle add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  const openFilterModal = () => {
    // Navigate to filter modal
    navigation.navigate('FilterModal');
  };

  const renderFilterChip = (label: string, isSelected: boolean = false, hasDropdown: boolean = false) => (
    <TouchableOpacity
      key={label}
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={() => handleFilterPress(label)}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {label}
      </Text>
      {hasDropdown && (
        <View style={styles.dropdownIcon}>
          <View style={styles.dropdownPath} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderQuantityControl = (product: ProductItem) => (
    <View style={styles.quantityControl}>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => handleQuantityChange(product.id, -1)}
      >
        <View style={styles.minusIcon} />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{product.quantity}</Text>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => handleQuantityChange(product.id, 1)}
      >
        <View style={styles.plusIconContainer}>
          <View style={styles.plusIconHorizontal} />
          <View style={styles.plusIconVertical} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = (product: ProductItem) => (
    <View key={product.id} style={styles.productCard}>
      {product.hasDiscount && (
        <View style={styles.discountLabel}>
          <View style={styles.discountIconContainer}>
            <View style={styles.discountIcon} />
            <Text style={styles.discountText}>-{product.discountPercent}%</Text>
          </View>
        </View>
      )}
      
      <View style={styles.productContent}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <View style={styles.productTextInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productDescription} numberOfLines={1}>
              {product.description}
            </Text>
          </View>
          <Text style={styles.productPrice}>{product.price}</Text>
        </View>
      </View>

      <View style={styles.productActions}>
        {renderQuantityControl(product)}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(product.id)}
        >
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFC" />
      
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <SafeAreaView>
          <View style={styles.statusBar}>
            <Text style={styles.timeText}>9:41</Text>
            <View style={styles.statusIcons}>
              <View style={styles.signalIcon} />
              <View style={styles.wifiIcon} />
              <View style={styles.batteryIcon} />
            </View>
          </View>
        </SafeAreaView>
        
        <View style={styles.topAppBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
            <View style={styles.filterIconContainer}>
              <View style={styles.filterLine1} />
              <View style={styles.filterLine2} />
              <View style={styles.filterLine3} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Grocery Title */}
          <Text style={styles.groceryTitle}>Grocery</Text>

          {/* Filter Chips */}
          <View style={styles.filterChipsContainer}>
            {renderFilterChip('All', selectedFilter === 'All')}
            {renderFilterChip('Sale')}
            {renderFilterChip('Bundles')}
            {renderFilterChip('Brands', false, true)}
            {renderFilterChip('Sort By')}
          </View>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {products.map(renderProductCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  fixedHeader: {
    backgroundColor: '#FCFCFC',
    paddingBottom: 0,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    fontFamily: 'DM Sans',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  signalIcon: {
    width: 17,
    height: 11,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  wifiIcon: {
    width: 15,
    height: 11,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  batteryIcon: {
    width: 24,
    height: 11,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  topAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 16,
    height: 16,
    backgroundColor: '#334155',
    // Custom arrow shape would need custom drawing or SVG
  },
  filterButton: {
    width: 36,
    height: 36,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  filterLine1: {
    width: 20,
    height: 2,
    backgroundColor: '#1E293B',
    borderRadius: 1,
  },
  filterLine2: {
    width: 14,
    height: 2,
    backgroundColor: '#1E293B',
    borderRadius: 1,
  },
  filterLine3: {
    width: 20,
    height: 2,
    backgroundColor: '#1E293B',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 46,
  },
  groceryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 20,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterChipSelected: {
    backgroundColor: '#009D66',
    borderColor: '#009D66',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    fontFamily: 'DM Sans',
  },
  filterChipTextSelected: {
    color: '#FFF',
  },
  dropdownIcon: {
    width: 6,
    height: 3,
  },
  dropdownPath: {
    width: 6,
    height: 3,
    backgroundColor: '#475569',
    // Custom dropdown arrow shape
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFF',
    position: 'relative',
  },
  discountLabel: {
    position: 'absolute',
    top: 22,
    left: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    backgroundColor: '#FAB001',
    zIndex: 1,
  },
  discountIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountIcon: {
    width: 7,
    height: 7,
    backgroundColor: '#1E293B',
  },
  discountText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 11,
  },
  productContent: {
    gap: 6,
  },
  productImage: {
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    gap: 4,
  },
  productTextInfo: {
    gap: 2,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    fontFamily: 'DM Sans',
  },
  productDescription: {
    fontSize: 10,
    fontWeight: '400',
    color: '#475569',
    fontFamily: 'DM Sans',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF5D21',
    fontFamily: 'DM Sans',
  },
  productActions: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FAFBFC',
    gap: 10,
  },
  quantityButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusIcon: {
    width: 12,
    height: 2,
    backgroundColor: '#334155',
    borderRadius: 1,
  },
  quantityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    fontFamily: 'DM Sans',
  },
  plusIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  plusIconHorizontal: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#334155',
    borderRadius: 1,
  },
  plusIconVertical: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 1,
  },
  addToCartButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#026A49',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'DM Sans',
  },
});

export default GroceryScreen;
