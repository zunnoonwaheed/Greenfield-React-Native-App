/**
 * SellAdsScreen - Pixel-Perfect Marketplace Listing
 * Matches Figma design exactly
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
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

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

  const [products] = useState<Product[]>([
    {
      id: '1',
      title: 'Farm Tomatoes',
      description: 'Juicy, ripe, and handpicke...',
      price: 950,
      image: require('../images/sell/sell1.png'),
      category: 'Groceries',
      location: 'Dha Phase 2, Street 5',
      condition: 'New',
      specifications: ['Organic', 'Fresh', '5kg Pack'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
      },
    },
    {
      id: '2',
      title: 'Acer Nitro 5',
      description: 'Power-packed performan...',
      price: 145000,
      image: require('../images/sell/sell2.png'),
      category: 'Electronics, Mobile Phones',
      location: 'Dha Phase 2, Street 5',
      condition: 'Used',
      specifications: ['RTX 3060', '16GB RAM', '512GB SSD', '144Hz Display'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
      },
    },
    {
      id: '3',
      title: 'IPhone 13 Pro',
      description: 'Sleek design, excellent co...',
      price: 185000,
      image: require('../images/sell/sell3.png'),
      category: 'Electronics, Mobile Phones',
      location: 'Dha Phase 2, Street 5',
      condition: 'Used',
      specifications: ['128GB Storage', 'Graphite Color', 'Excellent Condition', 'Box Pack', 'Genuine Charger'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
      },
    },
    {
      id: '4',
      title: 'Basmati Rice (10kg)',
      description: 'Long-grain, aromatic rice f...',
      price: 2400,
      image: require('../images/sell/sell4.png'),
      category: 'Groceries',
      location: 'Dha Phase 2, Street 5',
      condition: 'New',
      specifications: ['Long Grain', 'Premium Quality', '10kg Pack'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
      },
    },
    {
      id: '5',
      title: 'Used Honda Civic 2019',
      description: 'Well-maintained, low mile...',
      price: 4200000,
      image: require('../images/sell/sell5.png'),
      category: 'Vehicles',
      location: 'Dha Phase 2, Street 5',
      condition: 'Used',
      specifications: ['Automatic', 'Low Mileage', 'Single Owner', 'Well Maintained'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
      },
    },
    {
      id: '6',
      title: 'Study Table',
      description: 'Durable, minimal design, p...',
      price: 12000,
      image: require('../images/sell/sell6.png'),
      category: 'Furniture',
      location: 'Dha Phase 2, Street 5',
      condition: 'Used',
      specifications: ['Solid Wood', 'With Drawer', 'Ergonomic Design'],
      seller: {
        name: 'Kashan Ali',
        image: require('../images/homepage-assets/Avatar.png'),
        datePosted: 'Oct 5, 2025',
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </ScrollView>

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