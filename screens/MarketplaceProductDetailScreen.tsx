/**
 * MarketplaceProductDetailScreen - Detailed Product Information for Sell/Ads
 * OLX-style product detail page with seller information
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import type { Product } from './SellAdsScreen';

type MarketplaceProductDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MarketplaceProductDetail'
>;
type MarketplaceProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'MarketplaceProductDetail'
>;

const MarketplaceProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<MarketplaceProductDetailScreenNavigationProp>();
  const route = useRoute<MarketplaceProductDetailScreenRouteProp>();
  const { product } = route.params as { product: Product };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactSeller = () => {
    navigation.navigate('ContactSeller', { product });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.shareButton}
        >
          <Ionicons name="share-social-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Price and Title */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>PKR {product.price.toLocaleString()}</Text>
            <Text style={styles.title}>{product.title}</Text>
          </View>

          {/* Location and Date */}
          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#777" />
              <Text style={styles.metaText}>{product.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#777" />
              <Text style={styles.metaText}>{product.seller.datePosted}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>{product.category}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Condition</Text>
                <View
                  style={[
                    styles.badgePill,
                    product.condition === 'New'
                      ? styles.badgePillGreen
                      : styles.badgePillOrange,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      product.condition === 'New'
                        ? styles.badgeTextGreen
                        : styles.badgeTextOrange,
                    ]}
                  >
                    {product.condition}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsList}>
                {product.specifications.map((spec, index) => (
                  <View key={index} style={styles.specItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#00A86B" />
                    <Text style={styles.specText}>{spec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerCard}>
              <Image
                source={product.seller.image}
                style={styles.sellerImage}
                resizeMode="cover"
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{product.seller.name}</Text>
                <Text style={styles.sellerDate}>
                  Member since {product.seller.datePosted}
                </Text>
              </View>
              <TouchableOpacity style={styles.callIconButton}>
                <Ionicons name="call-outline" size={20} color="#00A86B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Contact Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSeller}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins',
  },
  shareButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E5E5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  priceSection: {
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 28,
    fontFamily: 'Poppins',
  },
  metaSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#777',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  badgePill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgePillGreen: {
    backgroundColor: '#E8F5E9',
  },
  badgePillOrange: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  badgeTextGreen: {
    color: '#2E7D32',
  },
  badgeTextOrange: {
    color: '#E65100',
  },
  specsList: {
    gap: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specText: {
    fontSize: 14,
    color: '#555',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5E5',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  sellerDate: {
    fontSize: 12,
    color: '#777',
  },
  callIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00A86B',
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
  contactButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default MarketplaceProductDetailScreen;
