/**
 * CreateAdStep1 - Basic Details
 * Title, Description, Category, Condition, Price
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import CustomInput from '../../components/shared/CustomInput';
import CustomDropdown from '../../components/shared/CustomDropdown';
import CustomButton from '../../components/shared/CustomButton';

export interface Step1Data {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  condition: string;
  price: string;
  negotiable: boolean;
}

interface CreateAdStep1Props {
  data: Step1Data;
  onDataChange: (data: Step1Data) => void;
  onNext: () => void;
}

const CATEGORIES = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Grocery', value: 'grocery' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' },
];

const SUBCATEGORIES: { [key: string]: { label: string; value: string }[] } = {
  electronics: [
    { label: 'Mobile Phones', value: 'mobile' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Cameras', value: 'cameras' },
    { label: 'Gaming', value: 'gaming' },
  ],
  furniture: [
    { label: 'Chairs', value: 'chairs' },
    { label: 'Tables', value: 'tables' },
    { label: 'Beds', value: 'beds' },
    { label: 'Storage', value: 'storage' },
  ],
  grocery: [
    { label: 'Fruits', value: 'fruits' },
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Grains', value: 'grains' },
    { label: 'Dairy', value: 'dairy' },
  ],
  vehicles: [
    { label: 'Cars', value: 'cars' },
    { label: 'Motorcycles', value: 'motorcycles' },
    { label: 'Bicycles', value: 'bicycles' },
  ],
  clothing: [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Kids', value: 'kids' },
  ],
  books: [
    { label: 'Fiction', value: 'fiction' },
    { label: 'Non-Fiction', value: 'nonfiction' },
    { label: 'Academic', value: 'academic' },
  ],
};

const CONDITIONS = [
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' },
];

const CreateAdStep1: React.FC<CreateAdStep1Props> = ({
  data,
  onDataChange,
  onNext,
}) => {
  const updateField = (field: keyof Step1Data, value: any) => {
    onDataChange({ ...data, [field]: value });
  };

  const isFormValid = () => {
    return (
      data.title.trim() !== '' &&
      data.description.trim() !== '' &&
      data.category !== '' &&
      data.subcategory !== '' &&
      data.condition !== '' &&
      data.price.trim() !== ''
    );
  };

  const subcategoryOptions = data.category ? SUBCATEGORIES[data.category] || [] : [];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Sell What You Have, Earn What You Deserve!</Text>
        </View>

        {/* Form Fields */}
        <CustomInput
          label="Title"
          value={data.title}
          onChangeText={(text) => updateField('title', text)}
          placeholder="e.g. Fresh Farm Tomatoes – 5kg Crate"
          required
        />

        <CustomInput
          label="Description"
          value={data.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Describe your item (condition, features, etc.)"
          multiline
          numberOfLines={4}
          required
        />

        <CustomDropdown
          label="Category"
          value={data.category}
          onValueChange={(value) => {
            updateField('category', value);
            updateField('subcategory', ''); // Reset subcategory when category changes
          }}
          options={CATEGORIES}
          placeholder="e.g. Electronics, Furniture, Grocery..."
          required
        />

        <CustomDropdown
          label="Subcategory"
          value={data.subcategory}
          onValueChange={(value) => updateField('subcategory', value)}
          options={subcategoryOptions}
          placeholder="Select a subcategory"
          required
        />

        <CustomDropdown
          label="Condition"
          value={data.condition}
          onValueChange={(value) => updateField('condition', value)}
          options={CONDITIONS}
          placeholder="New / Used"
          required
        />

        <CustomInput
          label="Price"
          value={data.price}
          onChangeText={(text) => updateField('price', text)}
          placeholder="e.g. 400 PKR"
          keyboardType="numeric"
          required
        />

        {/* Negotiable Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Negotiable</Text>
          <Switch
            value={data.negotiable}
            onValueChange={(value) => updateField('negotiable', value)}
            trackColor={{ false: '#E5E5E5', true: '#A0E7C9' }}
            thumbColor={data.negotiable ? '#00A86B' : '#F4F4F4'}
            ios_backgroundColor="#E5E5E5"
          />
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <CustomButton
          title="Next"
          onPress={onNext}
          disabled={!isFormValid()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
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
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
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
});

export default CreateAdStep1;
