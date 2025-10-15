import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { getProfile } from '../api/userAPI';
import { getUserData } from '../api/axiosConfig';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const confettiAnimations = useRef<Animated.Value[]>([]);
  const confettiCount = 50;
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize confetti animations
    for (let i = 0; i < confettiCount; i++) {
      confettiAnimations.current[i] = new Animated.Value(0);
    }

    // Start confetti animation
    startConfettiAnimation();

    // Load user data
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // First try to get from local storage
      const userData = await getUserData();
      if (userData) {
        setUserName(userData.name || 'User');
      } else {
        // Fetch from API
        const response = await getProfile();
        if (response.success && response.data.user) {
          setUserName(response.data.user.name || 'User');
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUserName('User');
    } finally {
      setLoading(false);
    }
  };

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
    navigation.navigate('Home');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderConfetti = () => {
    const confettiElements = [];
    const colors = ['#E84118', '#9C88FF', '#FF6B9D', '#4834DF'];

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
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

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
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Illustration Placeholder */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Ionicons name="checkmark-circle" size={120} color="#0D7F6F" />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0D7F6F" />
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
    backgroundColor: '#F8F9FA',
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
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
    zIndex: 2,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  illustrationPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#0D7F6F',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D7F6F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default WelcomeScreen;