/**
 * ContactSellerScreen - Seller Contact Interface
 * Clean, minimal design for contacting sellers
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import type { Product } from './SellAdsScreen';

type ContactSellerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ContactSeller'
>;
type ContactSellerScreenRouteProp = RouteProp<
  RootStackParamList,
  'ContactSeller'
>;

const ContactSellerScreen: React.FC = () => {
  const navigation = useNavigation<ContactSellerScreenNavigationProp>();
  const route = useRoute<ContactSellerScreenRouteProp>();
  const { product } = route.params as { product: Product };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCall = () => {
    Alert.alert(
      'Call Seller',
      `Call ${product.seller.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would have the actual phone number
            Linking.openURL('tel:+923001234567');
          }
        },
      ]
    );
  };

  const handleMessage = () => {
    navigation.navigate('Messages');
  };

  const handleWhatsApp = () => {
    Alert.alert(
      'WhatsApp',
      `Chat with ${product.seller.name} on WhatsApp?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open WhatsApp',
          onPress: () => {
            // In a real app, this would have the actual WhatsApp number
            Linking.openURL('https://wa.me/923001234567');
          }
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Contact Seller</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Background Image with Overlay */}
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={product.image}
          style={styles.backgroundImage}
          resizeMode="cover"
          blurRadius={10}
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        {/* Seller Profile */}
        <View style={styles.sellerSection}>
          <Image
            source={product.seller.image}
            style={styles.sellerAvatar}
            resizeMode="cover"
          />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{product.seller.name}</Text>
            <View style={styles.sellerMeta}>
              <Ionicons name="star" size={16} color="#FFB300" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.memberSince}>• Member since {product.seller.datePosted}</Text>
            </View>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productSection}>
          <Text style={styles.productLabel}>Product</Text>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>PKR {product.price.toLocaleString()}</Text>
          <Text style={styles.productLocation}>
            <Ionicons name="location-outline" size={14} color="#777" />
            {' '}{product.location}
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.contactOptions}>
          <TouchableOpacity
            style={[styles.contactButton, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Ionicons name="call" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, styles.messageButton]}
            onPress={handleMessage}
            activeOpacity={0.8}
          >
            <View style={styles.buttonIconContainer}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.contactButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={handleWhatsApp}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
          <Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text>
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
    zIndex: 10,
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
  headerSpacer: {
    width: 40,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentCard: {
    marginTop: 150,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sellerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E5E5E5',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sellerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  sellerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  sellerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  memberSince: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  productSection: {
    marginBottom: 24,
  },
  productLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  productLocation: {
    fontSize: 13,
    color: '#777',
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#00A86B',
  },
  messageButton: {
    backgroundColor: '#2196F3',
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default ContactSellerScreen;
