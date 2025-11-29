import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getCategories } from '../api/categories';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 4; // 4 columns, 16px padding on each side, 16px total gaps

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Category {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

// Image mapping for categories - maps category names to local images
// All categories are loaded dynamically from backend database
const categoryImages: Record<string, ImageSourcePropType> = {
  'sexual wellness': require('../images/homepage-assets/groceries.png'),
  '100% organic': require('../images/homepage-assets/100%organic.png'),
  'air fresheners': require('../images/homepage-assets/air-freshners.png'),
  'baby care products': require('../images/homepage-assets/baby-care.png'),
  'baby care': require('../images/homepage-assets/baby-care.png'),
  'baby food & formula milk': require('../images/homepage-assets/baby-care.png'),
  'baby shampoo': require('../images/homepage-assets/baby-care.png'),
  'bakery items': require('../images/homepage-assets/bakery-items.png'),
  'baking essentials': require('../images/homepage-assets/baking-essentials.png'),
  'batteries & light bulbs': require('../images/homepage-assets/batteries.png'),
  'beverages': require('../images/homepage-assets/beverages.png'),
  'birthday & party supplies': require('../images/homepage-assets/party-suppliers.png'),
  'party supplies': require('../images/homepage-assets/party-suppliers.png'),
  'biscuits & cookies': require('../images/homepage-assets/biscuits-cookies.png'),
  'bread': require('../images/homepage-assets/bakery-items.png'),
  'butter & cream': require('../images/homepage-assets/dairy.png'),
  'cereals & oats': require('../images/homepage-assets/cereals.png'),
  'cheese (local & imported)': require('../images/homepage-assets/dairy.png'),
  'chips & crisps': require('../images/homepage-assets/chips.png'),
  'chocolates and candies': require('../images/homepage-assets/chocolates.png'),
  'chocolates & candies': require('../images/homepage-assets/chocolates.png'),
  'cinnamon': require('../images/homepage-assets/spices.png'),
  'cleaning essentials': require('../images/homepage-assets/cleaning-essentials.png'),
  'cooking oil & ghee': require('../images/homepage-assets/groceries.png'),
  'dairy': require('../images/homepage-assets/dairy.png'),
  'detergents & soaps': require('../images/homepage-assets/cleaning-essentials.png'),
  'diapers & wipes': require('../images/homepage-assets/baby-care.png'),
  'dishwashing liquids & bars': require('../images/homepage-assets/cleaning-essentials.png'),
  'eggs': require('../images/homepage-assets/groceries.png'),
  'energy drinks': require('../images/homepage-assets/beverages.png'),
  'essential groceries': require('../images/homepage-assets/groceries.png'),
  'feminine hygiene': require('../images/homepage-assets/woman-care.png'),
  'first aid & medicines': require('../images/homepage-assets/medicines.png'),
  'medicines': require('../images/homepage-assets/medicines.png'),
  'flavoured milk': require('../images/homepage-assets/dairy.png'),
  'flour': require('../images/homepage-assets/groceries.png'),
  'fresh fruits': require('../images/homepage-assets/fruits.png'),
  'fruits': require('../images/homepage-assets/fruits.png'),
  'fresh meat (beef, mutton, chicken)': require('../images/homepage-assets/meat.png'),
  'meat': require('../images/homepage-assets/meat.png'),
  'fresh vegetables': require('../images/homepage-assets/veggies.png'),
  'veggies': require('../images/homepage-assets/veggies.png'),
  'frozen items': require('../images/homepage-assets/frozen.png'),
  'frozen': require('../images/homepage-assets/frozen.png'),
  'hair care & styling': require('../images/homepage-assets/grooming.png'),
  'hico': require('../images/homepage-assets/groceries.png'),
  'home made': require('../images/homepage-assets/groceries.png'),
  'icecreams': require('../images/homepage-assets/icecream.png'),
  'ice creams': require('../images/homepage-assets/icecream.png'),
  'insect & mosquito killer - repellents': require('../images/homepage-assets/repellents.png'),
  'repellents': require('../images/homepage-assets/repellents.png'),
  'instant noodles, pasta & spaghetti': require('../images/homepage-assets/instant-food.png'),
  'instant food': require('../images/homepage-assets/instant-food.png'),
  'jams & spreads': require('../images/homepage-assets/groceries.png'),
  'juices': require('../images/homepage-assets/beverages.png'),
  'k&ns': require('../images/homepage-assets/meat.png'),
  'kitchenware & plastic items': require('../images/homepage-assets/kitchenware.png'),
  'kitchenware': require('../images/homepage-assets/kitchenware.png'),
  'menu': require('../images/homepage-assets/groceries.png'),
  'milk and cream': require('../images/homepage-assets/dairy.png'),
  'monsalwa': require('../images/homepage-assets/groceries.png'),
  'non-alcoholic drinks': require('../images/homepage-assets/beverages.png'),
  'nutritional drinks': require('../images/homepage-assets/beverages.png'),
  'nuts & dry fruits': require('../images/homepage-assets/dry-fruits.png'),
  'dry fruits': require('../images/homepage-assets/dry-fruits.png'),
  'opa french fries': require('../images/homepage-assets/frozen.png'),
  'oral & dental care': require('../images/homepage-assets/oral-care.png'),
  'oral care': require('../images/homepage-assets/oral-care.png'),
  'pet food (dogs, cats, birds, fish)': require('../images/homepage-assets/pet-food.png'),
  'pet food': require('../images/homepage-assets/pet-food.png'),
  'pickles & condiments': require('../images/homepage-assets/pickles.png'),
  'pickles': require('../images/homepage-assets/pickles.png'),
  'powdered drinks': require('../images/homepage-assets/beverages.png'),
  'pulses, lentils & beans': require('../images/homepage-assets/groceries.png'),
  'rice': require('../images/homepage-assets/groceries.png'),
  'sabroso': require('../images/homepage-assets/groceries.png'),
  'salt': require('../images/homepage-assets/groceries.png'),
  'sauces, mayo & ketchup': require('../images/homepage-assets/groceries.png'),
  'shaving & grooming': require('../images/homepage-assets/grooming.png'),
  'grooming': require('../images/homepage-assets/grooming.png'),
  'skincare & cosmetics': require('../images/homepage-assets/grooming.png'),
  'soft drinks': require('../images/homepage-assets/beverages.png'),
  'spices & recipes': require('../images/homepage-assets/spices.png'),
  'spices': require('../images/homepage-assets/spices.png'),
  'stationery': require('../images/homepage-assets/stationary.png'),
  'sugar': require('../images/homepage-assets/groceries.png'),
  'surface & tile cleaners': require('../images/homepage-assets/cleaning-essentials.png'),
  'tea whiteners & sweeteners': require('../images/homepage-assets/tea.png'),
  'tea, green tea & coffee': require('../images/homepage-assets/tea.png'),
  'tea & sugar': require('../images/homepage-assets/tea.png'),
  'tissues, toilet rolls, kitchen towels': require('../images/homepage-assets/tissues.png'),
  'tissues': require('../images/homepage-assets/tissues.png'),
  'toiletries': require('../images/homepage-assets/cleaning-essentials.png'),
  'toothbrushes': require('../images/homepage-assets/oral-care.png'),
  'toothpaste': require('../images/homepage-assets/oral-care.png'),
  'toys & kids\' play items': require('../images/homepage-assets/toys.png'),
  'toys': require('../images/homepage-assets/toys.png'),
  'traditional snacks (nimco etc)': require('../images/homepage-assets/chips.png'),
  'walls': require('../images/homepage-assets/icecream.png'),
  'women\'s care': require('../images/homepage-assets/woman-care.png'),
  'women care': require('../images/homepage-assets/woman-care.png'),
  'yoghurt': require('../images/homepage-assets/dairy.png'),
  'grocery bundles': require('../images/homepage-assets/shop-cat1.png'),
  'fresh produce': require('../images/homepage-assets/shop-cat4.png'),
  'dairy & bakery': require('../images/homepage-assets/shop-cat3.png'),
  'snacks & beverages': require('../images/homepage-assets/shop-cat2.png'),
};

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  // Start with empty state - load ALL categories from database
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('📂 Loading categories from backend...');
      const response = await getCategories();
      if (response.success && response.data?.categories) {
        const mappedCategories = response.data.categories.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          // Use dynamic image from backend (same as web app)
          image: cat.image_url ? { uri: cat.image_url } : require('../images/homepage-assets/groceries.png'),
        }));
        setCategories(mappedCategories);
        console.log('✅ Loaded', mappedCategories.length, 'categories from web database');
      } else {
        console.warn('⚠️ Failed to load categories from backend');
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };
  const renderCategoryItem = (item: Category) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryCard}
      onPress={() => {
        console.log(`📂 Category ${item.name} (ID: ${item.id}) clicked`);
        navigation.navigate('GroceryList', {
          categoryId: item.id,
          categoryName: item.name
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={item.image}
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
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28B446" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available</Text>
          </View>
        ) : (
          renderCategoriesGrid()
        )}
      </ScrollView>
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
  },
  backArrow: {
    fontSize: 28,
    color: '#1E293B',
    fontWeight: '400',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: CARD_SIZE,
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
});

export default CategoriesScreen;
