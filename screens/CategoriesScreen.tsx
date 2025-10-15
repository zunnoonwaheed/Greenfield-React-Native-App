import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const categoryItemWidth = (width - 64 - 36) / 4; // Accounting for padding and gaps

interface Category {
  id: string;
  name: string;
  icon: string;
}

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  const categories: Category[] = [
    { id: '1', name: 'Fresh Vegetables', icon: '🥬' },
    { id: '2', name: 'Fresh Produce', icon: '🥕' },
    { id: '3', name: 'Dairy & Bakery', icon: '🧀' },
    { id: '4', name: 'Snacks & Beverages', icon: '🥤' },
    { id: '5', name: 'Canteen / Fast Food', icon: '🍖' },
    { id: '6', name: 'Household Essentials', icon: '🧽' },
    { id: '7', name: 'Personal Care', icon: '🧴' },
    { id: '8', name: 'Fish & Seafood', icon: '🐟' },
    { id: '9', name: 'Tea & Coffee', icon: '☕' },
    { id: '10', name: 'Honey & Mustard', icon: '🍯' },
    { id: '11', name: 'Bread & Baking', icon: '🍞' },
    { id: '12', name: 'Spices & Herbs', icon: '🌿' },
    { id: '13', name: 'Fruits', icon: '🍎' },
    { id: '14', name: 'Icecreams', icon: '🍦' },
    { id: '15', name: 'Tins & Jars', icon: '🥫' },
    { id: '16', name: 'Wheat', icon: '🌾' },
    { id: '17', name: 'Corn Flakes', icon: '🥣' },
  ];

  const renderCategoryItem = (item: Category) => (
    <TouchableOpacity key={item.id} style={styles.categoryItem} onPress={() => navigation.navigate('GroceryList')}>
      <View style={styles.categoryImageContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>📶</Text>
            <Text style={styles.statusIcon}>🔋</Text>
          </View>
        </View>
        
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Categories</Text>
        
        <ScrollView 
          style={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {renderCategoriesGrid()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'DM Sans',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    color: '#334155',
    fontSize: 14,
  },
  topBar: {
    paddingVertical: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#334155',
    fontSize: 20,
    fontWeight: '600',
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
    fontSize: 32,
  },
  categoryText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default CategoriesScreen;
