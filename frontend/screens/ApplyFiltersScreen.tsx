import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

interface FilterOption {
  label: string;
  value: string;
}

const ApplyFiltersScreen: React.FC = () => {
  const navigation = useNavigation();

  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [discount, setDiscount] = useState('');
  const [ratings, setRatings] = useState('');
  const [delivery, setDelivery] = useState('');
  const [brand, setBrand] = useState('');
  const [packaging, setPackaging] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Alyas Farms', 'Anees Farms']);

  const allFieldsFilled = priceRange && sortBy && discount && ratings && delivery && brand && packaging;

  const removeBrand = (brandName: string) => {
    setSelectedBrands(selectedBrands.filter(b => b !== brandName));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters...');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Apply Search Filters</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Price Range</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/price-range-icon.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {priceRange || 'Enter budget (PKR)'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Sort By</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/sort-by-icon.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {sortBy || 'e.g. Price (Low to High / High to Low)'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Discount / Offers */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Discount / Offers</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/percent.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {discount || 'e.g. Show items on discount'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Ratings & Reviews */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Ratings & Reviews</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/star.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {ratings || 'e.g. 4★ & above'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Delivery / Pickup */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Delivery / Pickup</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/package-check.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {delivery || 'e.g. Free delivery'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Brand / Seller */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>Brand / Seller</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/tags.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {brand || 'e.g. Select by seller or brand name'}
              </Text>
            </TouchableOpacity>

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
            <TouchableOpacity style={styles.dropdownButton}>
              <Image
                source={require('../images/homepage-assets/package.png')}
                style={styles.iconLeft}
                resizeMode="contain"
              />
              <Text style={styles.dropdownPlaceholder}>
                {packaging || 'e.g. Single item'}
              </Text>
              <Image
                source={require('../images/homepage-assets/Dropdown Icon.png')}
                style={styles.iconRight}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#475569',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
    marginTop: 8,
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

export default ApplyFiltersScreen;
