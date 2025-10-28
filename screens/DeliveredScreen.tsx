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

type DeliveredNavigationProp = StackNavigationProp<MainStackParamList, 'Delivered'>;

const DeliveredScreen: React.FC = () => {
  const navigation = useNavigation<DeliveredNavigationProp>();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppHeader title="Delivered" showBack={true} showHome={true} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../images/frame1.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Delivered ✅</Text>

        {/* Description */}
        <Text style={styles.description}>
          Delivered successfully! We hope you love your order. Don't forget to rate your experience.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <ThemedButton
            title="Back to Home"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }}
            type="solid"
          />
          <ThemedButton
            title="Rate Order ⭐"
            onPress={() => {
              // Navigate to rating screen (can be added later)
              console.log('Rate order');
            }}
            type="outline"
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
  buttonsContainer: {
    width: '100%',
    gap: Spacing.medium,
  },
});

export default DeliveredScreen;
