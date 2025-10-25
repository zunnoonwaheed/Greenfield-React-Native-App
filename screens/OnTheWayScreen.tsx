import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type OnTheWayNavigationProp = StackNavigationProp<RootStackParamList>;

const OnTheWayScreen: React.FC = () => {
  const navigation = useNavigation<OnTheWayNavigationProp>();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Auto-progress to next screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Delivered' as any);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: '80%' }]} />
          </View>
        </View>

        {/* Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/frame2.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>On the Way 🛵</Text>

        {/* Description */}
        <Text style={styles.description}>
          Good news! Your order is on its way. Sit tight—our delivery partner is bringing it straight to your doorstep.
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Delivered' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 40,
    left: 32,
    right: 32,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A8A4E',
    borderRadius: 3,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: '85%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 8,
    fontFamily: 'Poppins',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0A8A4E',
    borderRadius: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A8A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default OnTheWayScreen;
