import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getCategories } from '../api/getCategories';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 4; // 4 columns

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Category {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string;
  icon?: string;
}

// Map category names to local images
const CATEGORY_IMAGE_MAP: { [key: string]: any } = {
  'Groceries': require('../images/homepage-assets/groceries.png'),
  'Beverages': require('../images/homepage-assets/beverages.png'),
  'Frozen': require('../images/homepage-assets/frozen.png'),
  'Fruits': require('../images/homepage-assets/fruits.png'),
  'Veggies': require('../images/homepage-assets/veggies.png'),
  'Ice Creams': require('../images/homepage-assets/icecream.png'),
  'Baby Care': require('../images/homepage-assets/baby-care.png'),
  'Dairy': require('../images/homepage-assets/dairy.png'),
  '100% Organic': require('../images/homepage-assets/100%organic.png'),
  'Air Fresheners': require('../images/homepage-assets/air-freshners.png'),
  'Bakery Items': require('../images/homepage-assets/bakery-items.png'),
  'Baking Essentials': require('../images/homepage-assets/baking-essentials.png'),
  'Party Supplies': require('../images/homepage-assets/party-suppliers.png'),
  'Biscuits & Cookies': require('../images/homepage-assets/biscuits-cookies.png'),
  'Cereals & Oats': require('../images/homepage-assets/cereals.png'),
  'Chips & Crisps': require('../images/homepage-assets/chips.png'),
  'Chocolates & Candies': require('../images/homepage-assets/chocolates.png'),
  'Cleaning Essentials': require('../images/homepage-assets/cleaning-essentials.png'),
  'Batteries & Light Bulbs': require('../images/homepage-assets/batteries.png'),
  'Women Care': require('../images/homepage-assets/woman-care.png'),
  'Meat': require('../images/homepage-assets/meat.png'),
  'Medicines': require('../images/homepage-assets/medicines.png'),
  'Repellents': require('../images/homepage-assets/repellents.png'),
  'Kitchenware': require('../images/homepage-assets/kitchenware.png'),
  'Instant Food': require('../images/homepage-assets/instant-food.png'),
  'Dry Fruits': require('../images/homepage-assets/dry-fruits.png'),
  'Oral Care': require('../images/homepage-assets/oral-care.png'),
  'Pet Food': require('../images/homepage-assets/pet-food.png'),
  'Pickles': require('../images/homepage-assets/pickles.png'),
  'Spices': require('../images/homepage-assets/spices.png'),
  'Grooming': require('../images/homepage-assets/grooming.png'),
  'Stationery': require('../images/homepage-assets/stationary.png'),
  'Tea & Sugar': require('../images/homepage-assets/tea.png'),
  'Tissues': require('../images/homepage-assets/tissues.png'),
  'Toys': require('../images/homepage-assets/toys.png'),
  'Fresh Produce': require('../images/homepage-assets/fruits.png'),
  'Snacks & Beverages': require('../images/homepage-assets/chips.png'),
  'Grocery Bundles': require('../images/homepage-assets/shop-cat1.png'),
  'Dairy & Bakery': require('../images/homepage-assets/shop-cat3.png'),
};

const CategoriesScreenDynamic: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from backend
  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    setLoading(true);
    try {
      console.log('📂 Loading categories from backend...');
      const response = await getCategories();

      if (response.success && response.data && response.data.categories) {
        const cats = response.data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image_url: cat.image_url,
          icon: cat.icon,
        }));

        setCategories(cats);
        console.log(`✅ Loaded ${cats.length} categories`);
      } else {
        console.warn('⚠️ No categories returned from backend');
        Alert.alert('Warning', 'No categories available');
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (category: Category) => {
    // Try to get local image mapping first
    if (CATEGORY_IMAGE_MAP[category.name]) {
      return CATEGORY_IMAGE_MAP[category.name];
    }

    // If backend provides image URL, use it (would need { uri: url } format)
    if (category.image_url) {
      return { uri: category.image_url };
    }

    // Default fallback
    return require('../images/homepage-assets/groceries.png');
  };

  const renderCategoryItem = (item: Category) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryCard}
      onPress={() => {
        console.log(`Category ${item.name} clicked - navigating to products`);
        navigation.navigate('GroceryList', {
          categoryId: item.id,
          categoryName: item.name
        } as any);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={getCategoryImage(item)}
          style={styles.categoryImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          {loading ? 'Loading...' : `${categories.length} categories`}
        </Text>
      </View>

      {/* Categories Grid or Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : categories.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCategoriesGrid()}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#1E293B',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontFamily: 'DM Sans',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: CARD_SIZE,
    alignItems: 'center',
    gap: 8,
  },
  categoryImageContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryImage: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: 'DM Sans',
    maxWidth: CARD_SIZE,
    lineHeight: 16,
  },
});

export default CategoriesScreenDynamic;
