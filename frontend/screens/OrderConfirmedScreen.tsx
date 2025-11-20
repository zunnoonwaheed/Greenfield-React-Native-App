import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { ThemedButton } from '../components/ThemedButton';

type OrderConfirmedNavigationProp = StackNavigationProp<MainStackParamList, 'OrderConfirmed'>;

const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#A05BFF', '#FF6BA7', '#20BF55', '#FFC107'];

const OrderConfirmedScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmedNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confetti = useRef([...Array(55)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Confetti animation (same as WelcomeScreen)
    const loops = confetti.map((v, i) =>
      Animated.loop(
        Animated.timing(v, {
          toValue: 1,
          duration: 2600 + (i % 10) * 140,
          useNativeDriver: true,
        })
      )
    );
    Animated.stagger(85, loops).start();
  }, []);

  const confettiPositions = useRef(
    [...Array(55)].map(() => ({
      x: Math.random() * width,
      size: 4 + Math.random() * 6,
    }))
  ).current;

  const renderConfetti = () =>
    confetti.map((v, i) => {
      const { x, size } = confettiPositions[i];
      const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
      const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-100, height + 100] });
      return (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.confetti,
            {
              left: x,
              width: size,
              height: size * 2,
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              transform: [{ translateY }, { rotate }],
            },
          ]}
        />
      );
    });

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

      {/* Confetti Animation */}
      <View style={styles.confettiWrap}>{renderConfetti()}</View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Order Confirmed Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/homepage-assets/order-confirm.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Order Confirmed!</Text>

        {/* Description */}
        <Text style={styles.description}>
          Thank you for your order. Your food is being freshly prepared and will be on its way soon. Sit tight—deliciousness is coming!
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <ThemedButton
            title="Continue To Home"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }}
            type="outline"
          />
          <ThemedButton
            title="Track Order"
            onPress={() => navigation.navigate('Preparing')}
            type="solid"
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
  confettiWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  illustration: {
    width: '90%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: Spacing.medium,
  },
  buttonsContainer: {
    width: '100%',
    gap: Spacing.medium,
  },
});

export default OrderConfirmedScreen;
