import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

export interface FilterState {
  priceRange: string;
  sortBy: string;
  discount: string;
  ratings: string;
  delivery: string;
  brandSeller: string;
  packaging: string;
  selectedBrands: string[];
}

interface FilterModalScreenProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const FilterModalScreen: React.FC<FilterModalScreenProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters
}) => {
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);
  const [sortBy, setSortBy] = useState(currentFilters.sortBy);
  const [discount, setDiscount] = useState(currentFilters.discount);
  const [ratings, setRatings] = useState(currentFilters.ratings);
  const [delivery, setDelivery] = useState(currentFilters.delivery);
  const [brandSeller, setBrandSeller] = useState(currentFilters.brandSeller);
  const [packaging, setPackaging] = useState(currentFilters.packaging);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.selectedBrands);

  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [showRatingsDropdown, setShowRatingsDropdown] = useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
  const [showPackagingDropdown, setShowPackagingDropdown] = useState(false);

  // Available brands for selection
  const availableBrands = ['Arya Farms', 'FreshMart', 'GreenLeaf', 'SnackTime'];

  // Price range options
  const priceRangeOptions = ['Under $50', '$50 - $100', '$100 - $300', 'Above $300'];

  // Sort options
  const sortByOptions = ['Price (Low to High)', 'Price (High to Low)', 'Rating', 'Newest'];

  // Discount options
  const discountOptions = ['10% or more', '20% or more', '30% or more', '50% or more'];

  // Rating options
  const ratingOptions = ['4.8 & above', '4.5 & above', '4.0 & above', '3.5 & above'];

  // Delivery options
  const deliveryOptions = ['Free delivery', 'Express delivery', 'Same day delivery'];

  // Packaging options
  const packagingOptions = ['Single item', 'Pack of 2', 'Pack of 5', 'Bulk pack'];

  // Reset local state when modal opens with current filters
  useEffect(() => {
    if (visible) {
      console.log('Filter modal is now visible');
      setPriceRange(currentFilters.priceRange);
      setSortBy(currentFilters.sortBy);
      setDiscount(currentFilters.discount);
      setRatings(currentFilters.ratings);
      setDelivery(currentFilters.delivery);
      setBrandSeller(currentFilters.brandSeller);
      setPackaging(currentFilters.packaging);
      setSelectedBrands(currentFilters.selectedBrands);
    } else {
      console.log('Filter modal is now hidden');
    }
  }, [visible, currentFilters]);

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter(b => b !== brand));
  };

  const handleAddBrand = (brand: string) => {
    if (!selectedBrands.includes(brand)) {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      priceRange,
      sortBy,
      discount,
      ratings,
      delivery,
      brandSeller,
      packaging,
      selectedBrands,
    };
    onApply(filters);
  };

  const renderDropdownOptions = (
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <View style={styles.dropdownOptionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.dropdownOption,
            currentValue === option && styles.dropdownOptionSelected
          ]}
          onPress={() => {
            onSelect(option);
            onClose();
          }}
        >
          <Text
            style={[
              styles.dropdownOptionText,
              currentValue === option && styles.dropdownOptionTextSelected
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Apply Search Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <View style={styles.closeIconContainer}>
                  <View style={styles.closeIconLine1} />
                  <View style={styles.closeIconLine2} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowPriceDropdown(!showPriceDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownIcon}>$</Text>
                    <Text style={styles.dropdownPlaceholder}>
                      {priceRange || 'Enter Budget (USD)'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showPriceDropdown && renderDropdownOptions(
                  priceRangeOptions,
                  priceRange,
                  setPriceRange,
                  () => setShowPriceDropdown(false)
                )}
              </View>

              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.sortIcon}>
                      <View style={styles.sortArrowUp} />
                      <View style={styles.sortArrowDown} />
                    </View>
                    <Text style={styles.dropdownPlaceholder}>
                      {sortBy || 'e.g. Price (Low to High / High to Low)'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showSortDropdown && renderDropdownOptions(
                  sortByOptions,
                  sortBy,
                  setSortBy,
                  () => setShowSortDropdown(false)
                )}
              </View>

              {/* Discount / Offers */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Discount / Offers</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDiscountDropdown(!showDiscountDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.percentIcon}>
                      <View style={styles.percentCircle1} />
                      <View style={styles.percentLine} />
                      <View style={styles.percentCircle2} />
                    </View>
                    <Text style={styles.dropdownPlaceholder}>
                      {discount || 'e.g. Show items on discount'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showDiscountDropdown && renderDropdownOptions(
                  discountOptions,
                  discount,
                  setDiscount,
                  () => setShowDiscountDropdown(false)
                )}
              </View>

              {/* Ratings & Reviews */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Ratings & Reviews</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowRatingsDropdown(!showRatingsDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.starIcon}>
                      <View style={styles.starPath} />
                    </View>
                    <Text style={styles.dropdownPlaceholder}>
                      {ratings || 'e.g. 4.8 & above'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showRatingsDropdown && renderDropdownOptions(
                  ratingOptions,
                  ratings,
                  setRatings,
                  () => setShowRatingsDropdown(false)
                )}
              </View>

              {/* Delivery / Pickup */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Delivery / Pickup</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.truckIcon}>
                      <View style={styles.truckBody} />
                    </View>
                    <Text style={styles.dropdownPlaceholder}>
                      {delivery || 'e.g. Free delivery'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showDeliveryDropdown && renderDropdownOptions(
                  deliveryOptions,
                  delivery,
                  setDelivery,
                  () => setShowDeliveryDropdown(false)
                )}
              </View>

              {/* Brand / Seller */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Brand / Seller</Text>
                <View style={styles.dropdown}>
                  <View style={styles.dropdownContent}>
                    <View style={styles.tagIcon}>
                      <View style={styles.tagPath} />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Select by seller or brand name"
                      placeholderTextColor="#94A3B8"
                      value={brandSeller}
                      onChangeText={setBrandSeller}
                    />
                  </View>
                </View>

                {/* Available brands to select */}
                <View style={styles.brandSelectContainer}>
                  <Text style={styles.brandHelper}>Quick select:</Text>
                  <View style={styles.brandOptionsContainer}>
                    {availableBrands.map((brand) => (
                      <TouchableOpacity
                        key={brand}
                        style={[
                          styles.brandOption,
                          selectedBrands.includes(brand) && styles.brandOptionSelected
                        ]}
                        onPress={() => {
                          if (selectedBrands.includes(brand)) {
                            handleRemoveBrand(brand);
                          } else {
                            handleAddBrand(brand);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.brandOptionText,
                            selectedBrands.includes(brand) && styles.brandOptionTextSelected
                          ]}
                        >
                          {brand}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Selected brand chips - Green pills like "Arya Farms" */}
                {selectedBrands.length > 0 && (
                  <View style={styles.brandChipsContainer}>
                    {selectedBrands.map((brand) => (
                      <View key={brand} style={styles.brandChip}>
                        <Text style={styles.brandChipText}>{brand}</Text>
                        <TouchableOpacity onPress={() => handleRemoveBrand(brand)}>
                          <View style={styles.removeIcon}>
                            <View style={styles.removeIconLine1} />
                            <View style={styles.removeIconLine2} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Packaging / Quantity */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Packaging / Quantity</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowPackagingDropdown(!showPackagingDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.packageIcon}>
                      <View style={styles.packagePath} />
                    </View>
                    <Text style={styles.dropdownPlaceholder}>
                      {packaging || 'e.g. Single Item'}
                    </Text>
                  </View>
                  <View style={styles.chevronDown}>
                    <View style={styles.chevronPath} />
                  </View>
                </TouchableOpacity>
                {showPackagingDropdown && renderDropdownOptions(
                  packagingOptions,
                  packaging,
                  setPackaging,
                  () => setShowPackagingDropdown(false)
                )}
              </View>
            </ScrollView>

            {/* Apply Button - Matching Figma green */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  headerTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.text,
    fontFamily: 'DM Sans',
  },
  closeButton: {
    width: Layout.iconSize,
    height: Layout.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    width: 14,
    height: 14,
    position: 'relative',
  },
  closeIconLine1: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: Colors.gray[700],
    transform: [{ rotate: '45deg' }],
    top: 6,
  },
  closeIconLine2: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: Colors.gray[700],
    transform: [{ rotate: '-45deg' }],
    top: 6,
  },
  scrollView: {
    paddingHorizontal: Spacing.screenPadding,
    flexGrow: 1,
  },
  scrollViewContent: {
    paddingBottom: Spacing.screenPadding,
  },
  filterSection: {
    marginTop: Spacing.screenPadding,
  },
  filterLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.text,
    fontFamily: 'DM Sans',
    marginBottom: Spacing.gap,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: 14,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gap,
    flex: 1,
  },
  dropdownIcon: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.gray[600],
    fontFamily: 'DM Sans',
  },
  dropdownPlaceholder: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textLight,
    fontFamily: 'DM Sans',
    flex: 1,
  },
  chevronDown: {
    width: 12,
    height: 12,
  },
  chevronPath: {
    width: 8,
    height: 4,
    backgroundColor: Colors.textLight,
  },
  sortIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortArrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderStyle: 'solid',
    borderLeftColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderBottomColor: Colors.gray[600],
    marginBottom: 2,
  },
  sortArrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderStyle: 'solid',
    borderLeftColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderTopColor: Colors.gray[600],
  },
  percentIcon: {
    width: 16,
    height: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  percentCircle1: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray[600],
    position: 'absolute',
    top: 0,
    left: 0,
  },
  percentLine: {
    width: 14,
    height: 2,
    backgroundColor: Colors.gray[600],
    transform: [{ rotate: '-45deg' }],
  },
  percentCircle2: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray[600],
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  starPath: {
    width: 16,
    height: 16,
    backgroundColor: Colors.gray[600],
  },
  truckIcon: {
    width: 16,
    height: 16,
  },
  truckBody: {
    width: 16,
    height: 12,
    backgroundColor: Colors.gray[600],
    borderRadius: 2,
  },
  tagIcon: {
    width: 16,
    height: 16,
  },
  tagPath: {
    width: 14,
    height: 14,
    backgroundColor: Colors.gray[600],
    borderRadius: 2,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.text,
    fontFamily: 'DM Sans',
    padding: 0,
  },
  brandSelectContainer: {
    marginTop: Spacing.gap,
  },
  brandHelper: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    fontFamily: 'DM Sans',
    marginBottom: Spacing.small,
  },
  brandOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  brandOption: {
    paddingHorizontal: Spacing.gap,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  brandOptionSelected: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.successDark,
  },
  brandOptionText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.gray[600],
    fontFamily: 'DM Sans',
  },
  brandOptionTextSelected: {
    color: Colors.successDark,
  },
  brandChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
    marginTop: Spacing.gap,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.gap,
    paddingVertical: 6,
    borderRadius: BorderRadius.modal,
    backgroundColor: Colors.successLight,
  },
  brandChipText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.successDark,
    fontFamily: 'DM Sans',
  },
  removeIcon: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  removeIconLine1: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: Colors.successDark,
    transform: [{ rotate: '45deg' }],
    top: 5,
  },
  removeIconLine2: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: Colors.successDark,
    transform: [{ rotate: '-45deg' }],
    top: 5,
  },
  packageIcon: {
    width: 16,
    height: 16,
  },
  packagePath: {
    width: 16,
    height: 14,
    backgroundColor: Colors.gray[600],
    borderRadius: 2,
  },
  dropdownOptionsContainer: {
    marginTop: Spacing.small,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.gap,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  dropdownOptionSelected: {
    backgroundColor: Colors.successLight,
  },
  dropdownOptionText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.gray[600],
    fontFamily: 'DM Sans',
  },
  dropdownOptionTextSelected: {
    color: Colors.successDark,
    fontWeight: Typography.semibold,
  },
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[50],
    backgroundColor: Colors.white,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.white,
    fontFamily: 'DM Sans',
  },
});

export default FilterModalScreen;
