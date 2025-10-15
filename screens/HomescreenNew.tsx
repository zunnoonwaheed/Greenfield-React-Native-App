import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type HomescreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

interface BundleItem {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  image: string;
  quantity: number;
}

const HomescreenNew: React.FC = () => {
  const navigation = useNavigation<HomescreenNavigationProp>();

  const categories: CategoryItem[] = [
    { id: '1', name: 'Grocery Bundles', image: '🛒' },
    { id: '2', name: 'Fresh Produce', image: '🥬' },
    { id: '3', name: 'Dairy & Bakery', image: '🧀' },
    { id: '4', name: 'Snacks & Beverages', image: '🥤' },
    { id: '5', name: 'Canteen / Fast Food', image: '🍖' },
    { id: '6', name: 'Household Essentials', image: '🧽' },
    { id: '7', name: 'Personal Care', image: '🧴' },
    { id: '8', name: 'Fresh Farm Meat', image: '🐟' },
  ];

  const bundles: BundleItem[] = [
    {
      id: '1',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      discount: '-%23',
      image: '📦',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      discount: '-%23',
      image: '📦',
      quantity: 1,
    },
    {
      id: '3',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar, and spices – packed in one bundle',
      price: '699 Rs',
      discount: '-%23',
      image: '📦',
      quantity: 1,
    },
  ];

  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem}>
      <View style={styles.categoryImageContainer}>
        <Text style={styles.categoryImage}>{item.image}</Text>
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderBundleItem = (item: BundleItem) => (
    <View key={item.id} style={styles.bundleCard}>
      <View style={styles.discountLabel}>
        <Text style={styles.discountIcon}>⚡</Text>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <View style={styles.bundleContent}>
        <View style={styles.bundleImageContainer}>
          <Text style={styles.bundleImage}>{item.image}</Text>
        </View>
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleName}>{item.name}</Text>
          <Text style={styles.bundleDescription} numberOfLines={1}>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#026A49" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>🔋</Text>
          </View>
        </View>
        
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🛒</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            <Text style={styles.deliverText}>
              Deliver to <Text style={styles.locationText}>Sky Avenue</Text>
            </Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.searchPlaceholder}>Start Shopping</Text>
            <View style={styles.cursor} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.listImage}>📋</Text>
              </View>
              <Text style={styles.listTitle}>List No 3</Text>
              <Text style={styles.listItems}>Rice, Spice, Fish, Meat</Text>
              <TouchableOpacity style={styles.addItemsButton}>
                <Text style={styles.addItemsText}>Add Items</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.listCard}>
              <View style={styles.listImageContainer}>
                <Text style={styles.listImage}>📋</Text>
              </View>
              <Text style={styles.listTitle}>List No 3</Text>
              <Text style={styles.listItems}>Rice, Spice, Fish, Meat</Text>
              <TouchableOpacity style={styles.addItemsButton}>
                <Text style={styles.addItemsText}>Add Items</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Categories</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    backgroundColor: '#026A49',
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 32,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    color: '#FFF',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#FFF',
    fontSize: 24,
  },
  headerContent: {
    gap: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliverText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'DM Sans',
  },
  locationText: {
    fontWeight: '700',
  },
  dropdownIcon: {
    color: '#FFF',
    fontSize: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 2,
  },
  searchPlaceholder: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    flex: 1,
  },
  cursor: {
    width: 1,
    height: 16,
    backgroundColor: '#A3F7CD',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  chevronRight: {
    color: '#334155',
    fontSize: 20,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
    width: 85,
  },
  categoryImageContainer: {
    width: 86,
    height: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    fontSize: 32,
  },
  categoryText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  bundlesContainer: {
    flexDirection: 'row',
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
    fontSize: 40,
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
  listsContainer: {
    flexDirection: 'row',
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
    backgroundColor: '#009D66',
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
  listImage: {
    fontSize: 40,
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
    borderRadius: 4,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemsText: {
    color: '#026A49',
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

export default HomescreenNew;
