import React from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 4; // 4 columns, 16px padding on each side, 16px total gaps

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Category {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  const categories: Category[] = [
    { id: '1', name: 'Groceries', image: require('../images/homepage-assets/groceries.png') },
    { id: '2', name: 'Beverages', image: require('../images/homepage-assets/beverages.png') },
    { id: '3', name: 'Frozen', image: require('../images/homepage-assets/frozen.png') },
    { id: '4', name: 'Fruits', image: require('../images/homepage-assets/fruits.png') },
    { id: '5', name: 'Veggies', image: require('../images/homepage-assets/veggies.png') },
    { id: '6', name: 'Ice Creams', image: require('../images/homepage-assets/icecream.png') },
    { id: '7', name: 'Baby Care', image: require('../images/homepage-assets/baby-care.png') },
    { id: '8', name: 'Dairy', image: require('../images/homepage-assets/dairy.png') },
    { id: '9', name: '100% Organic', image: require('../images/homepage-assets/100%organic.png') },
    { id: '10', name: 'Air Fresheners', image: require('../images/homepage-assets/air-freshners.png') },
    { id: '11', name: 'Bakery Items', image: require('../images/homepage-assets/bakery-items.png') },
    { id: '12', name: 'Baking Essentials', image: require('../images/homepage-assets/baking-essentials.png') },
    { id: '13', name: 'Party Supplies', image: require('../images/homepage-assets/party-suppliers.png') },
    { id: '14', name: 'Biscuits & Cookies', image: require('../images/homepage-assets/biscuits-cookies.png') },
    { id: '15', name: 'Cereals & Oats', image: require('../images/homepage-assets/cereals.png') },
    { id: '16', name: 'Chips & Crisps', image: require('../images/homepage-assets/chips.png') },
    { id: '17', name: 'Chocolates & Candies', image: require('../images/homepage-assets/chocolates.png') },
    { id: '18', name: 'Cleaning Essentials', image: require('../images/homepage-assets/cleaning-essentials.png') },
    { id: '19', name: 'Batteries & Light Bulbs', image: require('../images/homepage-assets/batteries.png') },
    { id: '20', name: 'Women Care', image: require('../images/homepage-assets/woman-care.png') },
    { id: '21', name: 'Meat', image: require('../images/homepage-assets/meat.png') },
    { id: '22', name: 'Medicines', image: require('../images/homepage-assets/medicines.png') },
    { id: '23', name: 'Repellents', image: require('../images/homepage-assets/repellents.png') },
    { id: '24', name: 'Kitchenware', image: require('../images/homepage-assets/kitchenware.png') },
    { id: '25', name: 'Instant Food', image: require('../images/homepage-assets/instant-food.png') },
    { id: '26', name: 'Dry Fruits', image: require('../images/homepage-assets/dry-fruits.png') },
    { id: '27', name: 'Oral Care', image: require('../images/homepage-assets/oral-care.png') },
    { id: '28', name: 'Pet Food', image: require('../images/homepage-assets/pet-food.png') },
    { id: '29', name: 'Pickles', image: require('../images/homepage-assets/pickles.png') },
    { id: '30', name: 'Spices', image: require('../images/homepage-assets/spices.png') },
    { id: '31', name: 'Grooming', image: require('../images/homepage-assets/grooming.png') },
    { id: '32', name: 'Stationery', image: require('../images/homepage-assets/stationary.png') },
    { id: '33', name: 'Tea & Sugar', image: require('../images/homepage-assets/tea.png') },
    { id: '34', name: 'Tissues', image: require('../images/homepage-assets/tissues.png') },
    { id: '35', name: 'Toys', image: require('../images/homepage-assets/toys.png') },
  ];
  const renderCategoryItem = (item: Category) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryCard}
      onPress={() => {
        console.log(`Category ${item.name} clicked`);
        navigation.navigate('GroceryList');
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
        {renderCategoriesGrid()}
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
});

export default CategoriesScreen;