import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface BrandChip {
  id: number;
  name: string;
}

const FilterModalWithSelectionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<BrandChip[]>([
    { id: 1, name: 'Alyas Farms' },
    { id: 2, name: 'Anees Farms' },
  ]);

  const handleClose = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const handleApplyFilters = () => {
    // Apply filters and return to GroceryList screen
    setModalVisible(false);
    // Navigate back to GroceryList, closing both modal screens
    navigation.navigate('GroceryList');
  };

  const handleRemoveBrand = (brandId: number) => {
    setSelectedBrands(prev => prev.filter(brand => brand.id !== brandId));
  };

  const renderInputField = (
    icon: React.ReactNode,
    text: string,
    hasDropdown: boolean = true,
    isSelected: boolean = false
  ) => (
    <View style={styles.inputField}>
      <View style={styles.inputContent}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.inputText, !isSelected && styles.placeholderText]}>
          {text}
        </Text>
      </View>
      {hasDropdown && (
        <View style={styles.dropdownIcon}>
          <View style={styles.dropdownPath} />
        </View>
      )}
    </View>
  );

  const renderDollarIcon = () => (
    <View style={styles.dollarIcon}>
      <View style={styles.dollarLine} />
      <View style={styles.dollarS1} />
      <View style={styles.dollarS2} />
    </View>
  );

  const renderSortIcon = () => (
    <View style={styles.sortIcon}>
      <View style={styles.sortArrow} />
      <View style={styles.sortLine1} />
      <View style={styles.sortLine2} />
      <View style={styles.sortLine3} />
    </View>
  );

  const renderPercentIcon = () => (
    <View style={styles.percentIcon}>
      <View style={styles.percentLine} />
      <View style={styles.percentCircle1} />
      <View style={styles.percentCircle2} />
    </View>
  );

  const renderStarIcon = () => (
    <View style={styles.starIcon}>
      <View style={styles.starShape} />
    </View>
  );

  const renderPackageIcon = () => (
    <View style={styles.packageIcon}>
      <View style={styles.packageBox} />
      <View style={styles.packageLine1} />
      <View style={styles.packageLine2} />
    </View>
  );

  const renderTagIcon = () => (
    <View style={styles.tagIcon}>
      <View style={styles.tagShape} />
      <View style={styles.tagHole} />
    </View>
  );

  const renderBrandChip = (brand: BrandChip) => (
    <View key={brand.id} style={styles.brandChip}>
      <Text style={styles.brandChipText}>{brand.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveBrand(brand.id)}>
        <View style={styles.brandRemoveIcon}>
          <View style={styles.brandRemoveLine1} />
          <View style={styles.brandRemoveLine2} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.6)" />
        
        {/* Background overlay */}
        <TouchableOpacity style={styles.overlay} onPress={handleClose} />
        
        {/* Modal content */}
        <View style={styles.modalContent}>
          <View style={styles.modalInner}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Apply Search Filters</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <View style={styles.closeIcon}>
                  <View style={styles.closeLine1} />
                  <View style={styles.closeLine2} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.filterContent}>
                
                {/* Price Range */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Price Range</Text>
                  {renderInputField(
                    renderDollarIcon(),
                    '300',
                    true,
                    true
                  )}
                </View>

                {/* Sort By */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Sort By</Text>
                  {renderInputField(
                    renderSortIcon(),
                    'Price (Low to High / High to Low)',
                    true,
                    true
                  )}
                </View>

                {/* Discount / Offers */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Discount / Offers</Text>
                  {renderInputField(
                    renderPercentIcon(),
                    'Show items on discount',
                    true,
                    true
                  )}
                </View>

                {/* Ratings & Reviews */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Ratings & Reviews</Text>
                  {renderInputField(
                    renderStarIcon(),
                    '4★ & above',
                    true,
                    true
                  )}
                </View>

                {/* Delivery / Pickup */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Delivery / Pickup</Text>
                  {renderInputField(
                    renderPackageIcon(),
                    'Free delivery',
                    true,
                    true
                  )}
                </View>

                {/* Brand / Seller */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Brand / Seller</Text>
                  {renderInputField(
                    renderTagIcon(),
                    'e.g. Select by seller or brand name',
                    false,
                    false
                  )}
                  
                  {/* Brand Chips */}
                  {selectedBrands.length > 0 && (
                    <View style={styles.brandChipsContainer}>
                      {selectedBrands.map(renderBrandChip)}
                    </View>
                  )}
                </View>

                {/* Packaging / Quantity */}
                <View style={styles.filterSection}>
                  <Text style={styles.sectionLabel}>Packaging / Quantity</Text>
                  {renderInputField(
                    renderPackageIcon(),
                    'Single item',
                    true,
                    true
                  )}
                </View>

              </View>
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    maxHeight: height * 0.8,
    paddingHorizontal: 31,
    paddingVertical: 28,
  },
  modalInner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'DM Sans',
  },
  closeButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  closeLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#0F172A',
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#0F172A',
    transform: [{ rotate: '-45deg' }],
  },
  scrollView: {
    flex: 1,
  },
  filterContent: {
    gap: 20,
  },
  filterSection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'DM Sans',
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FCFCFC',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    fontFamily: 'DM Sans',
    flex: 1,
  },
  placeholderText: {
    color: '#64748B',
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownPath: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0F172A',
  },
  brandChipsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#CFFCE3',
  },
  brandChipText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#009D66',
    fontFamily: 'DM Sans',
  },
  brandRemoveIcon: {
    width: 8,
    height: 8,
    position: 'relative',
  },
  brandRemoveLine1: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: '#009D66',
    transform: [{ rotate: '45deg' }],
  },
  brandRemoveLine2: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: '#009D66',
    transform: [{ rotate: '-45deg' }],
  },
  dollarIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  dollarLine: {
    position: 'absolute',
    top: 0,
    left: 9,
    width: 2,
    height: 20,
    backgroundColor: '#1E293B',
  },
  dollarS1: {
    position: 'absolute',
    top: 3,
    left: 5,
    width: 10,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderBottomWidth: 0,
  },
  dollarS2: {
    position: 'absolute',
    top: 10,
    left: 5,
    width: 10,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderTopWidth: 0,
  },
  sortIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  sortArrow: {
    position: 'absolute',
    top: 4,
    left: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#334155',
  },
  sortLine1: {
    position: 'absolute',
    top: 12,
    left: 11,
    width: 4,
    height: 2,
    backgroundColor: '#334155',
  },
  sortLine2: {
    position: 'absolute',
    top: 16,
    left: 11,
    width: 7,
    height: 2,
    backgroundColor: '#334155',
  },
  sortLine3: {
    position: 'absolute',
    top: 20,
    left: 11,
    width: 10,
    height: 2,
    backgroundColor: '#334155',
  },
  percentIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  percentLine: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 2,
    backgroundColor: '#334155',
    transform: [{ rotate: '45deg' }],
  },
  percentCircle1: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  percentCircle2: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  starIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starShape: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#334155',
    // Star shape would need custom path or SVG
  },
  packageIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  packageBox: {
    position: 'absolute',
    top: 5,
    left: 2,
    width: 16,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  packageLine1: {
    position: 'absolute',
    top: 2,
    left: 10,
    width: 2,
    height: 16,
    backgroundColor: '#334155',
  },
  packageLine2: {
    position: 'absolute',
    top: 9,
    left: 2,
    width: 16,
    height: 2,
    backgroundColor: '#334155',
  },
  tagIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  tagShape: {
    position: 'absolute',
    top: 2,
    left: 1,
    width: 16,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  tagHole: {
    position: 'absolute',
    top: 5,
    left: 8,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#1E293B',
  },
  applyButton: {
    backgroundColor: '#026A49',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'DM Sans',
  },
});

export default FilterModalWithSelectionsScreen;
