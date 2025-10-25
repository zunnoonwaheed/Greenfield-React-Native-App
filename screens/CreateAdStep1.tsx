/**
 * CreateAdStep1 - Basic Ad Information
 * Title, Description, Category, Condition, Price
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateAd } from './CreateAdContext';

// Mock category data with local images from categories-page-assets folder
const CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    image: require('../images/categories-page-assets/categoriespage1.png'),
    subcategories: ['Mobile Phones', 'Laptops', 'Cameras', 'Gaming', 'TVs', 'Audio Systems'],
  },
  {
    id: 2,
    name: 'Furniture',
    image: require('../images/categories-page-assets/categoriespage2.png'),
    subcategories: ['Chairs', 'Tables', 'Beds', 'Storage', 'Sofas', 'Wardrobes'],
  },
  {
    id: 3,
    name: 'Grocery',
    image: require('../images/categories-page-assets/categoriespage3.png'),
    subcategories: ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Bakery', 'Beverages'],
  },
  {
    id: 4,
    name: 'Vehicles',
    image: require('../images/categories-page-assets/categoriespage4.png'),
    subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Parts & Accessories'],
  },
  {
    id: 5,
    name: 'Clothing',
    image: require('../images/categories-page-assets/categoriespage5.png'),
    subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
  },
  {
    id: 6,
    name: 'Books',
    image: require('../images/categories-page-assets/categoriespage6.png'),
    subcategories: ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Magazines'],
  },
];

const CONDITIONS = ['New', 'Used'];

interface CreateAdStep1Props {
  onNext: () => void;
}

const CreateAdStep1: React.FC<CreateAdStep1Props> = ({ onNext }) => {
  const { adData, updateAdData } = useCreateAd();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  const selectedCategory = CATEGORIES.find((cat) => cat.id === adData.categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  const isFormValid = () => {
    return (
      adData.title.trim() !== '' &&
      adData.description.trim() !== '' &&
      adData.categoryId !== null &&
      adData.subcategory !== '' &&
      adData.condition !== '' &&
      adData.price.trim() !== ''
    );
  };

  const handleCategorySelect = (category: typeof CATEGORIES[0]) => {
    updateAdData({
      categoryId: category.id,
      categoryName: category.name,
      subcategory: '', // Reset subcategory when category changes
    });
    setShowCategoryModal(false);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    updateAdData({ subcategory });
    setShowSubcategoryModal(false);
  };

  const handleConditionSelect = (condition: string) => {
    updateAdData({ condition: condition.toLowerCase() as 'new' | 'used' });
    setShowConditionModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sell What You Have, Earn What You Deserve!
        </Text>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="create-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Title</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Fresh Farm Tomatoes – 5kg Crate"
            placeholderTextColor="#9E9E9E"
            value={adData.title}
            onChangeText={(text) => updateAdData({ title: text })}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Description</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Describe your item (condition, features, etc.)"
            placeholderTextColor="#9E9E9E"
            value={adData.description}
            onChangeText={(text) => updateAdData({ description: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="grid-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Category</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            {selectedCategory ? (
              <View style={styles.dropdownSelected}>
                <Image source={selectedCategory.image} style={styles.categoryIcon} />
                <Text style={styles.dropdownText}>{selectedCategory.name}</Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>Select a category</Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Subcategory Dropdown */}
        {selectedCategory && (
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Ionicons name="list-outline" size={20} color="#666" />
              <Text style={styles.inputLabel}>Subcategory</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSubcategoryModal(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  adData.subcategory ? styles.dropdownText : styles.dropdownPlaceholder,
                ]}
              >
                {adData.subcategory || 'Select a subcategory'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
        )}

        {/* Condition Dropdown */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Condition</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowConditionModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                adData.condition ? styles.dropdownText : styles.dropdownPlaceholder,
              ]}
            >
              {adData.condition ? adData.condition.charAt(0).toUpperCase() + adData.condition.slice(1) : 'New / Used'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Price Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Ionicons name="cash-outline" size={20} color="#666" />
            <Text style={styles.inputLabel}>Price</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 400 PKR"
            placeholderTextColor="#9E9E9E"
            value={adData.price}
            onChangeText={(text) => updateAdData({ price: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Negotiable Toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleLeft}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#666" />
            <Text style={styles.toggleLabel}>Price Negotiable</Text>
          </View>
          <Switch
            value={adData.negotiable}
            onValueChange={(value) => updateAdData({ negotiable: value })}
            trackColor={{ false: '#E5E5E5', true: '#A0E7C9' }}
            thumbColor={adData.negotiable ? '#00A86B' : '#F4F4F4'}
            ios_backgroundColor="#E5E5E5"
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
          onPress={onNext}
          disabled={!isFormValid()}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextButtonText, !isFormValid() && styles.nextButtonTextDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}
                  activeOpacity={0.7}
                >
                  <Image source={item.image} style={styles.modalCategoryIcon} />
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {adData.categoryId === item.id && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        visible={showSubcategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubcategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSubcategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subcategory</Text>
              <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={subcategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSubcategorySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {adData.subcategory === item && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Condition Modal */}
      <Modal
        visible={showConditionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConditionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowConditionModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Condition</Text>
              <TouchableOpacity onPress={() => setShowConditionModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CONDITIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleConditionSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {adData.condition === item.toLowerCase() && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
    fontSize: 14,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  nextButtonTextDisabled: {
    color: '#9E9E9E',
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
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  modalCategoryIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  modalItemText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
});

export default CreateAdStep1;
