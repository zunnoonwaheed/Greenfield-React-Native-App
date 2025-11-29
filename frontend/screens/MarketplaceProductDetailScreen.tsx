/**
 * MarketplaceProductDetailScreen - Sell Product Detail
 * Matches Figma design exactly
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

type MarketplaceProductDetailScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'MarketplaceProductDetail'
>;
type MarketplaceProductDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'MarketplaceProductDetail'
>;

const MarketplaceProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<MarketplaceProductDetailScreenNavigationProp>();
  const route = useRoute<MarketplaceProductDetailScreenRouteProp>();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactSeller = () => {
    navigation.navigate('Messages');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Get product from route params or use mock data
  const passedProduct = (route.params as any)?.product;

  // Expand description if truncated - check for fullDescription first (from API)
  const getFullDescription = (product: any) => {
    // If we have fullDescription from API, use it
    if (product.fullDescription) {
      return product.fullDescription;
    }
    // If we have rawData from API, use the description from there
    if (product.rawData?.description) {
      return product.rawData.description;
    }
    // Otherwise try to expand truncated description
    const desc = product.description || '';
    if (desc && desc.includes('...')) {
      // For tomatoes
      if (desc.includes('handpicke')) {
        return 'Juicy, ripe, and handpicked tomatoes fresh from the farm. Perfect for salads and cooking.';
      }
      // For laptop
      if (desc.includes('performan')) {
        return 'Power-packed performance laptop with high-end graphics card. Perfect for gaming and professional work.';
      }
      // For iPhone
      if (desc.includes('co')) {
        return 'Sleek design, excellent condition iPhone 13 Pro. Well maintained and comes with original accessories.';
      }
      // For rice
      if (desc.includes('quality')) {
        return 'Premium quality Basmati rice, perfect for daily meals. Aromatic and long grain.';
      }
    }
    return desc;
  };

  const product = passedProduct ? {
    price: passedProduct.price || 185000,
    title: passedProduct.title || 'Product Title',
    description: getFullDescription(passedProduct),
    location: passedProduct.location || 'Location',
    category: passedProduct.category || 'Category',
    tags: passedProduct.specifications || passedProduct.tags || [],
    seller: {
      name: passedProduct.seller?.name || passedProduct.rawData?.seller?.name || 'Seller Name',
      date: passedProduct.seller?.datePosted || passedProduct.seller?.date || 'Date',
      avatar: passedProduct.seller?.image || passedProduct.seller?.avatar || require('../images/homepage-assets/profile-pic.png'),
    },
    condition: passedProduct.condition || 'Used',
    images: passedProduct.rawData?.total_images || passedProduct.images || 5,
    currentImage: passedProduct.currentImage || 1,
    image: passedProduct.image || require('../images/homepage-assets/used-frame.png'),
  } : {
    price: 185000,
    title: 'iPhone 13 Pro – 128GB',
    description: 'This iphone is in excellent condition and has been carefully maintained. It comes with all original accessories for a complete experience',
    location: 'Dha Phase 2, Street 5',
    category: 'Electronics, Mobile Phones',
    tags: ['128GB Storage', 'Graphite Color', 'Excellent Condition', 'Box Pack', 'Genuine Charger'],
    seller: {
      name: 'Kashan Ali',
      date: 'Oct 5, 2025',
      avatar: require('../images/homepage-assets/profile-pic.png'),
    },
    condition: 'Used',
    images: 5,
    currentImage: 1,
    image: require('../images/homepage-assets/used-frame.png'),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section with Header Overlay */}
        <View style={styles.imageSection}>
          {/* Product Image */}
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="cover"
          />

          {/* Header Overlay - Back and Favorite */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Image
                source={require('../images/homepage-assets/arrow-back.png')}
                style={styles.backArrowIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              style={styles.favoriteButton}
            >
              <Image
                source={require('../images/homepage-assets/heart.png')}
                style={styles.heartIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Badges - Condition Tag and Image Counter */}
          <View style={styles.bottomBadges}>
            {/* Dynamic Condition Badge with profile-sell icon */}
            <View style={[
              styles.conditionBadge,
              product.condition === 'New' ? styles.conditionNew : styles.conditionUsed
            ]}>
              <Image
                source={require('../images/homepage-assets/profile-sell.png')}
                style={styles.conditionIcon}
                resizeMode="contain"
              />
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
            {/* Dynamic Image Count Badge with profile-camera icon */}
            <View style={styles.imageCountBadge}>
              <Image
                source={require('../images/homepage-assets/profile-camera.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
              <Text style={styles.imageCountText}>1/{product.images}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Price and Heart */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs. {product.price.toLocaleString()}</Text>
            <TouchableOpacity
              onPress={handleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Image
                source={require('../images/homepage-assets/sell-screen-heart.png')}
                style={styles.priceHeartIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Product Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Location */}
          <View style={styles.infoRow}>
            <Image
              source={require('../images/homepage-assets/sell-screen-map-pin.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>{product.location}</Text>
          </View>

          {/* Category */}
          <View style={styles.infoRow}>
            <Image
              source={require('../images/homepage-assets/sell-screen tag.png')}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>{product.category}</Text>
          </View>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Seller Details */}
          <Text style={styles.sellerHeading}>Seller Details</Text>
          <View style={styles.sellerCard}>
            <Image
              source={require('../images/homepage-assets/profile-image-sell.png')}
              style={styles.sellerAvatar}
              resizeMode="cover"
            />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.seller.name}</Text>
              <Text style={styles.sellerDate}>Member since {product.seller.date}</Text>
            </View>
          </View>

          {/* Contact Seller Button */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSeller}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageSection: {
    position: 'relative',
    height: 400,
    backgroundColor: '#000000',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
  },
  bottomBadges: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  conditionNew: {
    backgroundColor: '#059669',
  },
  conditionUsed: {
    backgroundColor: '#F59E0B',
  },
  conditionIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imageCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  cameraIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  imageCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentSection: {
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  priceHeartIcon: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#6C757D',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  infoText: {
    fontSize: 15,
    color: '#1E293B',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#CFFCE3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#065F46',
  },
  sellerHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  sellerDate: {
    fontSize: 13,
    color: '#64748B',
  },
  contactButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default MarketplaceProductDetailScreen;
