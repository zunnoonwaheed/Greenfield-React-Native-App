import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import SavedAddressesScreen from './SavedAddressesScreen';

type HomescreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

interface BundleItem {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  image: ImageSourcePropType;
  quantity: number;
}

const HomescreenNew: React.FC = () => {
  const navigation = useNavigation<HomescreenNavigationProp>();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Sky Avenue');

  useFocusEffect(
    React.useCallback(() => {
      loadDefaultAddress();
    }, [])
  );

  const loadDefaultAddress = () => {
    setDeliveryAddress('Sky Avenue');
  };

  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    loadDefaultAddress();
  };

  const categories: CategoryItem[] = [
    { id: '1', name: 'Grocery Bundles', image: require('../images/homepage-assets/home-shop-category.png') },
    { id: '2', name: 'Fresh Produce', image: require('../images/homepage-assets/home-shop-category1.png') },
    { id: '3', name: 'Dairy & Bakery', image: require('../images/homepage-assets/home-shop-category2.png') },
    { id: '4', name: 'Snacks & Beverages', image: require('../images/homepage-assets/home-shop-category3.png') },
  ];

  const bundles: BundleItem[] = [
    {
      id: '1',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      discount: '-23%',
      image: require('../images/homepage-assets/home-grocery1.png'),
      quantity: 1,
    },
    {
      id: '2',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      discount: '-23%',
      image: require('../images/homepage-assets/home-grocery2.png'),
      quantity: 1,
    },
    {
      id: '3',
      name: 'Family Bundle',
      description: 'Complete grocery pack with all essentials for your family',
      price: '899 Rs',
      discount: '-15%',
      image: require('../images/homepage-assets/home-grocery-list.png'),
      quantity: 1,
    },
  ];

  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => navigation.navigate('GroceryList')}>
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryImage} resizeMode="contain" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBundleItem = (item: BundleItem) => (
    <TouchableOpacity key={item.id} style={styles.bundleCard} onPress={() => navigation.navigate('ProductDetail' as any)}>
      <View style={styles.discountLabel}>
        <Text style={styles.discountIcon}>⚡</Text>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <View style={styles.bundleContent}>
        <View style={styles.bundleImageContainer}>
          <Image source={item.image} style={styles.bundleImage} resizeMode="cover" />
        </View>
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleName}>{item.name}</Text>
          <Text style={styles.bundleDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.bundlePrice}>{item.price}</Text>
        </View>
      </View>
      <View style={styles.bundleActions}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#166534" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart' as any)}
          >
            <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => setShowAddressModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.deliverText}>
              Deliver to <Text style={styles.locationText}>{deliveryAddress}</Text>
            </Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Text style={styles.searchPlaceholder}>Start Shopping</Text>
            <Ionicons name="mic-outline" size={20} color="#94A3B8" />
          </View>
        </View>
      </View>

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
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
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

        {/* Live Kitchen */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Kitchen</Text>
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
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('GroceryList')}>
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
                  source={require('../images/homepage-assets/home-grocery-list.png')}
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
                  source={require('../images/homepage-assets/home-grocery-list.png')}
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

      {showAddressModal && (
        <SavedAddressesScreen 
          onClose={handleAddressModalClose}
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
  header: {
    backgroundColor: '#166534',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    gap: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliverText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
  },
  locationText: {
    fontWeight: '700',
  },
  dropdownIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPlaceholder: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
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
    height: 150,
    borderRadius: 12,
  },
  section: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  chevronRight: {
    color: '#334155',
    fontSize: 24,
    fontWeight: '400',
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    gap: 8,
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    maxWidth: 80,
  },
  bundlesContainer: {
    paddingLeft: 16,
  },
  bundleCard: {
    width: 164,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    padding: 10,
    marginRight: 12,
    gap: 10,
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
  bundleContent: {
    gap: 6,
  },
  bundleImageContainer: {
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bundleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  bundleInfo: {
    gap: 2,
  },
  bundleName: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bundleDescription: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'DM Sans',
  },
  bundlePrice: {
    color: '#EF5D21',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  bundleActions: {
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
    borderColor: '#CBD5E1',
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
    fontSize: 12,
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
    backgroundColor: '#166534',
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
  listsContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
  createListCard: {
    width: 164,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    padding: 10,
    marginRight: 12,
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
    minHeight: 180,
  },
  createListIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  createListTitle: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  createListSubtitle: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  listCard: {
    width: 164,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    padding: 10,
    marginRight: 12,
    gap: 8,
  },
  listImageContainer: {
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listImageIcon: {
    width: 60,
    height: 60,
  },
  listTitle: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  listItems: {
    color: '#475569',
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
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  chatbotButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 999,
  },
  chatbotIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
});

export default HomescreenNew;