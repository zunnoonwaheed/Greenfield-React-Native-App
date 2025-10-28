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
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { AppHeader } from '../components/shared/AppHeader';
import { ThemedButton } from '../components/ThemedButton';

type OnTheWayNavigationProp = StackNavigationProp<MainStackParamList, 'OnTheWay'>;

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
      navigation.navigate('Delivered');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppHeader title="On the Way" showBack={true} showHome={true} />

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
        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Continue"
            onPress={() => navigation.navigate('Delivered')}
            type="solid"
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: Spacing.xxl,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  progressBackground: {
    height: 6,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.small,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  illustration: {
    width: '85%',
    height: '100%',
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.medium,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: Typography.body,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl + Spacing.small,
    paddingHorizontal: Spacing.small,
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default OnTheWayScreen;
