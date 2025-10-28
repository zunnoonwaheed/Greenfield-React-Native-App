import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { user } = useAuth();
  const confettiAnimations = useRef<Animated.Value[]>([]);
  const confettiCount = 50;
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize confetti animations
    for (let i = 0; i < confettiCount; i++) {
      confettiAnimations.current[i] = new Animated.Value(0);
    }

    // Start confetti animation
    startConfettiAnimation();

    // Get user name from AuthContext
    setUserName(user?.name || 'User');
  }, [user]);

  const startConfettiAnimation = () => {
    const animations = confettiAnimations.current.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });

    Animated.stagger(100, animations).start();
  };

  const handleStartExploring = () => {
    // Since this is in AuthStack and we're authenticated,
    // just going back will trigger the auth check and switch to MainStack
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderConfetti = () => {
    const confettiElements = [];
    const colors = [Colors.error, Colors.primary, Colors.accent, Colors.info];

    for (let i = 0; i < confettiCount; i++) {
      const randomX = Math.random() * width;
      const randomRotation = Math.random() * 360;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = Math.random() * 8 + 4;
      const randomDelay = Math.random() * 2000;

      const translateY = confettiAnimations.current[i]?.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height + 50],
      });

      const rotate = confettiAnimations.current[i]?.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      confettiElements.push(
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              left: randomX,
              width: randomSize,
              height: randomSize * 2,
              backgroundColor: randomColor,
              transform: [
                { translateY: translateY || 0 },
                { rotate: rotate || '0deg' },
              ],
            },
          ]}
        />
      );
    }

    return confettiElements;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundGray} />

      {/* Confetti Animation */}
      <View style={styles.confettiContainer}>
        {renderConfetti()}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={Layout.iconSize} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Illustration Placeholder */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Ionicons name="checkmark-circle" size={120} color={Colors.primary} />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <>
              <Text style={styles.title}>Welcome aboard{userName ? `, ${userName}` : ''}!</Text>
              <Text style={styles.subtitle}>
                Explore bundles, track orders, and post ads in one place.
              </Text>
            </>
          )}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartExploring}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Exploring</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    borderRadius: BorderRadius.none,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.screenPadding,
    zIndex: 2,
  },
  backButton: {
    width: Spacing.xxl,
    height: Spacing.xxl,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxl,
    zIndex: 2,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.screenPadding,
  },
  illustrationPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.large,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.black,
    marginBottom: Spacing.gap,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Spacing.large,
    paddingHorizontal: Spacing.small + 2,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.h6 + 1,
    fontWeight: Typography.semibold,
  },
});

export default WelcomeScreen;