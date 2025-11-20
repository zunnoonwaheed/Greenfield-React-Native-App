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
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');
const cardWidth = (width - 32 - 12) / 2; // 16px padding each side + 12px gap

type GroceryListNavigationProp = StackNavigationProp<RootStackParamList>;

interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  quantity: number;
}

const GroceryListScreen: React.FC = () => {
  const navigation = useNavigation<GroceryListNavigationProp>();
  const [cartCount] = useState(3);
  const [cartTotal] = useState(1200);
  const [showPopup, setShowPopup] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [discount, setDiscount] = useState('');
  const [ratings, setRatings] = useState('');
  const [delivery, setDelivery] = useState('');
  const [brand, setBrand] = useState('');
  const [packaging, setPackaging] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Alyas Farms', 'Anees Farms']);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log('Search request:', searchInput);
    setSearchInput('');
    setShowPopup(false);
  };

  const handleCancel = () => {
    setSearchInput('');
    setShowPopup(false);
  };

  const allFieldsFilled = priceRange && sortBy && discount && ratings && delivery && brand && packaging;

  const removeBrand = (brandName: string) => {
    setSelectedBrands(selectedBrands.filter(b => b !== brandName));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters...');
    setShowFilters(false);
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const selectOption = (field: string, value: string) => {
    switch (field) {
      case 'priceRange':
        setPriceRange(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'discount':
        setDiscount(value);
        break;
      case 'ratings':
        setRatings(value);
        break;
      case 'delivery':
        setDelivery(value);
        break;
      case 'brand':
        setBrand(value);
        break;
      case 'packaging':
        setPackaging(value);
        break;
    }
    setOpenDropdown(null);
  };

  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    {
      id: '1',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
    {
      id: '3',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
    {
      id: '4',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
    {
      id: '5',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
    {
      id: '6',
      name: 'Weekly Essentials',
      description: 'Rice, flour, pulses, oil, tea, sugar...',
      price: 'Rs. 699',
      discount: '-23%',
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id: string, change: number) => {
    setGroceryItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ProductDetail' as any)}
      activeOpacity={0.7}
    >
      {/* Discount Badge */}
      <View style={styles.discountLabel}>
        <Text style={styles.discountIcon}>⚡︎</Text>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../images/homepage-assets/grocery-bun.png')}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
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
            console.log(`Added item ${item.id} to cart`);
          }}
        >
          <Text style={styles.addToCartText} numberOfLines={1}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Missing Item Popup */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPopup(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.modalTitle}>Are We Missing Something?</Text>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>
              Tell us what you were searching for, and our team will try to add it soon.
            </Text>

            {/* Input */}
            <TextInput
              style={styles.modalInput}
              placeholder='e.g. "Soya Chunks", "Organic Honey"'
              placeholderTextColor="#94A3B8"
              value={searchInput}
              onChangeText={setSearchInput}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../images/homepage-assets/groceries-arrow.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Image
              source={require('../images/homepage-assets/filter-grocery.png')}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart' as any)}
          >
            <Image
              source={require('../images/homepage-assets/grocery-cart.png')}
              style={styles.cartIcon}
              resizeMode="contain"
            />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Grocery</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity style={styles.filterTabActive}>
          <Text style={styles.filterTabTextActive}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Bundles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Brands ⌄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Sort by</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={groceryItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* View Cart Button */}
      <TouchableOpacity
        style={styles.viewCartButton}
        onPress={() => navigation.navigate('Cart' as any)}
      >
        <View style={styles.viewCartLeft}>
          <View style={styles.cartCountBadge}>
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </View>
          <Text style={styles.viewCartText}>View Cart</Text>
        </View>
        <Text style={styles.cartTotalText}>Rs. {cartTotal}</Text>
      </TouchableOpacity>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.filtersOverlay}>
          <TouchableOpacity
            style={styles.filtersOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowFilters(false)}
          />
          <View style={styles.filtersModalContent}>
            {/* Header */}
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Apply Search Filters</Text>
              <TouchableOpacity
                style={styles.filtersCloseButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.filtersCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.filtersScrollView}
              contentContainerStyle={styles.filtersScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Price Range</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('priceRange')}
                >
                  <Image
                    source={require('../images/homepage-assets/price-range-icon.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, priceRange && styles.dropdownSelected]}>
                    {priceRange || 'Enter budget (PKR)'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'priceRange' && (
                  <View style={styles.dropdownMenu}>
                    {['300', '500', '1000', '2000', '5000+'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('priceRange', option)}
                      >
                        <Text style={styles.dropdownOptionText}>Rs. {option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Sort By</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('sortBy')}
                >
                  <Image
                    source={require('../images/homepage-assets/sort-by-icon.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, sortBy && styles.dropdownSelected]}>
                    {sortBy || 'e.g. Price (Low to High / High to Low)'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'sortBy' && (
                  <View style={styles.dropdownMenu}>
                    {['Price (Low to High)', 'Price (High to Low)', 'Newest First', 'Most Popular', 'Rating (High to Low)'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('sortBy', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Discount / Offers */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Discount / Offers</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('discount')}
                >
                  <Image
                    source={require('../images/homepage-assets/percent.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, discount && styles.dropdownSelected]}>
                    {discount || 'e.g. Show items on discount'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'discount' && (
                  <View style={styles.dropdownMenu}>
                    {['10% & above', '20% & above', '30% & above', '50% & above', 'Show all discounts'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('discount', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Ratings & Reviews */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Ratings & Reviews</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('ratings')}
                >
                  <Image
                    source={require('../images/homepage-assets/star.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, ratings && styles.dropdownSelected]}>
                    {ratings || 'e.g. 4★ & above'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'ratings' && (
                  <View style={styles.dropdownMenu}>
                    {['4★ & above', '3★ & above', '2★ & above', '1★ & above', 'All ratings'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('ratings', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Delivery / Pickup */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Delivery / Pickup</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('delivery')}
                >
                  <Image
                    source={require('../images/homepage-assets/package-check.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, delivery && styles.dropdownSelected]}>
                    {delivery || 'e.g. Free delivery'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'delivery' && (
                  <View style={styles.dropdownMenu}>
                    {['Free delivery', 'Express delivery', 'Standard delivery', 'Pickup available', 'All options'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('delivery', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Brand / Seller */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Brand / Seller</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('brand')}
                >
                  <Image
                    source={require('../images/homepage-assets/tags.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, brand && styles.dropdownSelected]}>
                    {brand || 'e.g. Select by seller or brand name'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'brand' && (
                  <View style={styles.dropdownMenu}>
                    {['Alyas Farms', 'Anees Farms', 'Green Valley', 'Fresh Foods', 'Organic Mart'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('brand', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}


                {/* Selected Brands */}
                {selectedBrands.length > 0 && (
                  <View style={styles.selectedBrandsContainer}>
                    {selectedBrands.map((brandName, index) => (
                      <View key={index} style={styles.brandChip}>
                        <Text style={styles.brandChipText}>{brandName}</Text>
                        <TouchableOpacity onPress={() => removeBrand(brandName)}>
                          <Text style={styles.brandChipClose}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Packaging / Quantity */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionLabel}>Packaging / Quantity</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown('packaging')}
                >
                  <Image
                    source={require('../images/homepage-assets/package.png')}
                    style={styles.iconLeft}
                    resizeMode="contain"
                  />
                  <Text style={[styles.dropdownPlaceholder, packaging && styles.dropdownSelected]}>
                    {packaging || 'e.g. Single item'}
                  </Text>
                  <Image
                    source={require('../images/homepage-assets/Dropdown Icon.png')}
                    style={styles.iconRight}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {openDropdown === 'packaging' && (
                  <View style={styles.dropdownMenu}>
                    {['Single item', 'Pack of 2', 'Pack of 5', 'Pack of 10', 'Bulk packaging'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => selectOption('packaging', option)}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Apply Filters Button */}
            <TouchableOpacity
              style={[
                styles.applyButton,
                allFieldsFilled ? styles.applyButtonActive : styles.applyButtonInactive
              ]}
              onPress={handleApplyFilters}
            >
              <Text
                style={[
                  styles.applyButtonText,
                  allFieldsFilled ? styles.applyButtonTextActive : styles.applyButtonTextInactive
                ]}
              >
                Apply Filters
              </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#009D66',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  filterTab: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTabText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  itemCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    position: 'relative',
  },
  discountLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FDB022',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  discountIcon: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '700',
  },
  discountText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  imageContainer: {
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    gap: 2,
    marginBottom: 8,
  },
  productName: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  productDescription: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    lineHeight: 16,
  },
  productPrice: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 6,
    paddingVertical: 5,
    gap: 8,
  },
  quantityButton: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    minWidth: 12,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 32,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    textAlign: 'center',
  },
  contactSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#475569',
  },
  contactLink: {
    color: '#EF4444',
    fontWeight: '600',
  },
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#009D66',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  viewCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartCountBadge: {
    backgroundColor: '#026A49',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  viewCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  cartTotalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#475569',
    fontWeight: '400',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 12,
    paddingRight: 40,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 16,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  filtersOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filtersOverlayTouchable: {
    flex: 1,
  },
  filtersModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    maxHeight: '75%',
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  filtersCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersCloseButtonText: {
    fontSize: 24,
    color: '#475569',
    fontWeight: '400',
  },
  filtersScrollView: {
    marginTop: 8,
    marginBottom: 8,
  },
  filtersScrollContent: {
    paddingBottom: 100,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'DM Sans',
    color: '#1E293B',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  iconLeft: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  iconRight: {
    width: 16,
    height: 16,
    marginLeft: 'auto',
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: '#94A3B8',
  },
  dropdownSelected: {
    color: '#1E293B',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  selectedBrandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3F7CD',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  brandChipText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  brandChipClose: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  applyButtonInactive: {
    backgroundColor: '#A3F7CD',
  },
  applyButtonActive: {
    backgroundColor: '#026A49',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  applyButtonTextInactive: {
    color: '#2DDA95',
  },
  applyButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default GroceryListScreen;