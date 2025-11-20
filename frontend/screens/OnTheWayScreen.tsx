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

type OnTheWayNavigationProp = StackNavigationProp<MainStackParamList, 'OnTheWay'>;

const OnTheWayScreen: React.FC = () => {
  const navigation = useNavigation<OnTheWayNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Auto-progress to next screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Delivered');
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

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
        {/* Delivery Timeline - Progress Bar */}
        <View style={styles.deliveryTimelineContainer}>
          <Image
            source={require('../images/homepage-assets/delivery-timeline.png')}
            style={styles.deliveryTimeline}
            resizeMode="contain"
          />
        </View>

        {/* Delivery Picture - Scooter Illustration */}
        <View style={styles.deliveryPictureContainer}>
          <Image
            source={require('../images/homepage-assets/delivery-picture.png')}
            style={styles.deliveryPicture}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>On the Way</Text>

        {/* Description */}
        <Text style={styles.description}>
          Good news! Your order is on its way. Sit tight—our delivery partner is bringing it straight to your doorstep.
        </Text>

        {/* Timeline - Expected Time */}
        <View style={styles.timelineContainer}>
          <Image
            source={require('../images/homepage-assets/timeline.png')}
            style={styles.timeline}
            resizeMode="contain"
          />
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
    paddingTop: 140,
  },
  deliveryTimelineContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  deliveryTimeline: {
    width: '100%',
    height: 30,
  },
  deliveryPictureContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  deliveryPicture: {
    width: '100%',
    height: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  timelineContainer: {
    width: '100%',
    alignItems: 'center',
  },
  timeline: {
    width: '100%',
    height: 50,
  },
});

export default OnTheWayScreen;
