/**
 * SellAdsScreen - Marketplace Listing with Local Images
 * Professional OLX-style marketplace interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type SellAdsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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
    image: any;
    datePosted: string;
  };
}

const SellAdsScreen: React.FC = () => {
  const navigation = useNavigation<SellAdsScreenNavigationProp>();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Product data with local images
  const [products] = useState<Product[]>([
    {
      id: '1',
      title: 'Farm Fresh Tomatoes',
      description: 'Organic, locally grown tomatoes. Premium quality, 5kg pack available.',
      price: 950,
      image: require('../images/sell/sell1.png'),
      category: 'Groceries',
      location: 'DHA Phase 2, Karachi',
      condition: 'New',
      specifications: ['Organic', 'Fresh', '5kg Pack'],
      seller: {
        name: 'Ahmed Khan',
        image: require('../images/homepage-assets/home-shop-category.png'),
        datePosted: '2 days ago',
      },
    },
    {
      id: '2',
      title: 'Acer Nitro 5 Gaming Laptop',
      description: 'RTX 3060, 16GB RAM, 512GB SSD, 144Hz display. Excellent gaming performance.',
      price: 145000,
      image: require('../images/sell/sell2.png'),
      category: 'Electronics',
      location: 'Clifton, Karachi',
      condition: 'Used',
      specifications: ['RTX 3060', '16GB RAM', '512GB SSD', '144Hz Display'],
      seller: {
        name: 'Sarah Ali',
        image: require('../images/homepage-assets/home-shop-category1.png'),
        datePosted: '1 week ago',
      },
    },
    {
      id: '3',
      title: 'iPhone 13 Pro Max',
      description: '256GB, Pacific Blue, mint condition with original box and accessories.',
      price: 185000,
      image: require('../images/sell/sell3.png'),
      category: 'Electronics',
      location: 'Gulshan-e-Iqbal, Karachi',
      condition: 'Used',
      specifications: ['256GB', 'Pacific Blue', 'Original Box', 'All Accessories'],
      seller: {
        name: 'Usman Malik',
        image: require('../images/homepage-assets/home-shop-category2.png'),
        datePosted: '3 days ago',
      },
    },
    {
      id: '4',
      title: 'Basmati Rice 10kg',
      description: 'Premium quality long grain basmati rice. Perfect for daily use.',
      price: 2400,
      image: require('../images/sell/sell4.png'),
      category: 'Groceries',
      location: 'Saddar, Karachi',
      condition: 'New',
      specifications: ['Long Grain', 'Premium Quality', '10kg Pack'],
      seller: {
        name: 'Fatima Hassan',
        image: require('../images/homepage-assets/home-shop-category3.png'),
        datePosted: '1 day ago',
      },
    },
    {
      id: '5',
      title: 'Used Honda Civic 2019',
      description: 'Excellent condition, low mileage, well maintained, single owner.',
      price: 4200000,
      image: require('../images/sell/sell5.png'),
      category: 'Vehicles',
      location: 'Defence, Karachi',
      condition: 'Used',
      specifications: ['Automatic', 'Low Mileage', 'Single Owner', 'Well Maintained'],
      seller: {
        name: 'Imran Siddiqui',
        image: require('../images/homepage-assets/home-shop-category.png'),
        datePosted: '5 days ago',
      },
    },
    {
      id: '6',
      title: 'Wooden Study Table',
      description: 'Solid wood construction, ergonomic design with drawer storage.',
      price: 12000,
      image: require('../images/sell/sell6.png'),
      category: 'Furniture',
      location: 'North Nazimabad, Karachi',
      condition: 'Used',
      specifications: ['Solid Wood', 'With Drawer', 'Ergonomic Design'],
      seller: {
        name: 'Zainab Ahmed',
        image: require('../images/homepage-assets/home-shop-category1.png'),
        datePosted: '4 days ago',
      },
    },
  ]);

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
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>PKR {item.price.toLocaleString()}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productLocation} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleAddNewAd}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={28} color="#00A86B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell/Ads</Text>
        <TouchableOpacity
          onPress={handleSearch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Ionicons name="search" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

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
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#777" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for products..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            <TouchableOpacity
              style={styles.searchSubmitButton}
              onPress={() => {
                setShowSearchModal(false);
                if (searchQuery.trim()) {
                  Alert.alert('Search', `Searching for: ${searchQuery}`);
                }
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
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.bold,
    color: Colors.black,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins',
  },
  productsContainer: {
    paddingHorizontal: Spacing.gap,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.medium,
  },
  productCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.backgroundDark,
  },
  productContent: {
    padding: Spacing.gap,
  },
  productTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins',
  },
  productDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
    minHeight: 28,
    lineHeight: 14,
  },
  productPrice: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.error,
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productLocation: {
    fontSize: Typography.tiny,
    color: Colors.textLight,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  searchModalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.card,
    padding: Spacing.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.screenPadding,
  },
  searchModalTitle: {
    fontSize: Typography.subheading,
    fontWeight: Typography.bold,
    color: Colors.black,
    fontFamily: 'Poppins',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 14,
    marginBottom: Spacing.screenPadding,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.black,
    marginLeft: Spacing.small + 2,
    padding: 0,
  },
  searchSubmitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchSubmitButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textWhite,
    fontFamily: 'Poppins',
  },
});

export default SellAdsScreen;
