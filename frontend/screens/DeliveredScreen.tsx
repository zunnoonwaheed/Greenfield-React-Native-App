import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

type DeliveredNavigationProp = StackNavigationProp<MainStackParamList, 'Delivered'>;

const DeliveredScreen: React.FC = () => {
  const navigation = useNavigation<DeliveredNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Image
          source={require('../images/homepage-assets/arrow-back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Content Card */}
        <View style={styles.card}>
          {/* Delivery Progress - 100% */}
          <View style={styles.deliveryProgressContainer}>
            <Image
              source={require('../images/homepage-assets/delivered-progress.png')}
              style={styles.deliveryProgress}
              resizeMode="contain"
            />
          </View>

          {/* Delivery Illustration */}
          <View style={styles.deliveredImageContainer}>
            <Image
              source={require('../images/homepage-assets/delivered.png')}
              style={styles.deliveredImage}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Delivered</Text>

          {/* Description */}
          <Text style={styles.description}>
            Delivered successfully! We hope you love your order. Don't forget to rate your experience and share your feedback.
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Continue To Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => {
                navigation.navigate('Review');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewButtonText}>Give Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  card: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  deliveryProgressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryProgress: {
    width: '100%',
    height: 25,
  },
  deliveredImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 200,
  },
  deliveredImage: {
    width: '90%',
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  homeButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  reviewButton: {
    backgroundColor: '#026A49',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  reviewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DeliveredScreen;
