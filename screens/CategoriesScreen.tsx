import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
// import { getCategories } from '../api/categoryAPI'; // Commented out - using local data

const { width } = Dimensions.get('window');

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const categoryItemWidth = (width - 64 - 36) / 4; // Accounting for padding and gaps (4 columns from Figma)

interface Category {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackCategories: Category[] = [
    { id: '1', name: 'Groceries', image: require('../images/categories-page-assets/categoriespage1.png') },
    { id: '2', name: 'Bakery', image: require('../images/categories-page-assets/categoriespage2.png') },
    { id: '3', name: 'Fresh Produce', image: require('../images/categories-page-assets/categoriespage8.png') },
    { id: '4', name: 'Frozen Foods', image: require('../images/categories-page-assets/categoriespage9.png') },
    { id: '5', name: 'Fruits', image: require('../images/categories-page-assets/categoriespage10.png') },
    { id: '6', name: 'Snacks', image: require('../images/categories-page-assets/categoriespage11.png') },
    { id: '7', name: 'Beverages', image: require('../images/categories-page-assets/categoriespage12.png') },
    { id: '8', name: 'Dairy', image: require('../images/categories-page-assets/categoriespage13.png') },
    { id: '9', name: 'Meat & Poultry', image: require('../images/categories-page-assets/categoriespage14.png') },
    { id: '10', name: 'Fish & Seafood', image: require('../images/categories-page-assets/categoriespage15.png') },
    { id: '11', name: 'Household', image: require('../images/categories-page-assets/categoriespage16.png') },
    { id: '12', name: 'Personal Care', image: require('../images/categories-page-assets/categoriespage17.png') },
    { id: '13', name: 'Baby Care', image: require('../images/categories-page-assets/categoriespage18.png') },
    { id: '14', name: 'Pet Care', image: require('../images/categories-page-assets/categoriespage19.png') },
    { id: '15', name: 'Organic', image: require('../images/categories-page-assets/categoriespage20.png') },
    { id: '16', name: 'Health Foods', image: require('../images/categories-page-assets/categoriespage21.png') },
    { id: '17', name: 'Breakfast', image: require('../images/categories-page-assets/categoriespage22.png') },
    { id: '18', name: 'Spices', image: require('../images/categories-page-assets/categoriespage23.png') },
    { id: '19', name: 'Oils', image: require('../images/categories-page-assets/categoriespage24.png') },
    { id: '20', name: 'Rice & Grains', image: require('../images/categories-page-assets/categoriespage25.png') },
    { id: '21', name: 'Pulses', image: require('../images/categories-page-assets/categoriespage26.png') },
    { id: '22', name: 'Canned Foods', image: require('../images/categories-page-assets/categoriespage27.png') },
    { id: '23', name: 'Sauces', image: require('../images/categories-page-assets/categoriespage30.png') },
    { id: '24', name: 'Desserts', image: require('../images/categories-page-assets/categoriespage33.png') },
    { id: '25', name: 'Tea & Coffee', image: require('../images/categories-page-assets/categoriespage34.png') },
    { id: '26', name: 'Condiments', image: require('../images/categories-page-assets/categoriespage35.png') },
    { id: '27', name: 'Dry Fruits', image: require('../images/categories-page-assets/categoriespage36.png') },
  ];

  useEffect(() => {
    // Use local categories data instead of API call
    // TODO: Re-enable API call when backend is ready
    loadLocalCategories();
  }, []);

  const loadLocalCategories = () => {
    // Simulate loading for smooth UX
    setLoading(true);
    setTimeout(() => {
      setCategories(fallbackCategories);
      setLoading(false);
    }, 100);
  };

  // Commented out for now - re-enable when backend is ready
  // const fetchCategories = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await getCategories();
  //
  //     if (response.success && response.data) {
  //       setCategories(response.data.map((category: any) => ({
  //         id: category.id.toString(),
  //         name: category.name,
  //         image: category.image || fallbackCategories.find(c => c.name === category.name)?.image || require('../images/categories-page-assets/categoriespage1.png'),
  //       })));
  //     }
  //   } catch (err: any) {
  //     console.error('Error fetching categories:', err);
  //     setError(err.message || 'Failed to load categories');
  //     setCategories(fallbackCategories);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderCategoryItem = (item: Category) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => navigation.navigate('GroceryList')}>
      <View style={styles.categoryImageContainer}>
        <Image source={item.image} style={styles.categoryIcon} resizeMode="contain" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCategoriesGrid = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 4) {
      const rowCategories = categories.slice(i, i + 4);
      rows.push(
        <View key={i} style={styles.categoryRow}>
          {rowCategories.map(renderCategoryItem)}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Header - No SafeAreaView, full-width */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Categories</Text>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <ScrollView
            style={styles.categoriesContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.categoriesGrid}>
              {renderCategoriesGrid()}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  pageTitle: {
    color: '#1E293B',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    marginBottom: 20,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoriesGrid: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
    width: categoryItemWidth,
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
  categoryIcon: {
    width: '80%',
    height: '80%',
  },
  categoryText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoriesScreen;
