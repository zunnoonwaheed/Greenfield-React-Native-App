import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { forgotPassword } from '../api/authAPI';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

const { width } = Dimensions.get('window');

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  onSendResetLink?: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSendResetLink,
}) => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email.trim());

      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Password reset link has been sent to your email',
          [
            {
              text: 'OK',
              onPress: () => {
                // In development, show token for testing
                // Response interceptor unwraps response.data, so access token directly
                if (response?.token) {
                  console.log('Reset Token (Dev Only):', response.token);
                  // Navigate to Reset Password screen with the token
                  navigation.navigate('ResetPassword');
                } else {
                  navigation.navigate('Login');
                }
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Unable to send reset link. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green Header with Back Arrow */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.arrowContainer}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Main content container positioned at bottom */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll send a link to reset your password.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.emailIconContainer}>
                    <View style={styles.emailIcon} />
                    <View style={styles.emailTriangle} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Send Reset Link Button */}
          <TouchableOpacity
            style={[styles.sendResetButton, loading && styles.sendResetButtonDisabled]}
            onPress={handleSendResetLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.sendResetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              <Text style={styles.loginRegularText}>Remember your password? </Text>
              <Text style={styles.loginLink} onPress={handleLoginPress}>Login</Text>
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    backgroundColor: Colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.small,
    height: 56,
  },
  backButton: {
    width: Layout.buttonHeight,
    height: Layout.buttonHeight,
    borderRadius: BorderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11.667,
    paddingHorizontal: 10,
  },
  arrowContainer: {
    width: Layout.iconSize,
    height: Layout.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowLine: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: Colors.white,
    left: 5,
  },
  arrowHead: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: Colors.transparent,
    borderBottomColor: Colors.transparent,
    borderRightColor: Colors.white,
  },
  placeholder: {
    width: Layout.buttonHeight,
    height: Layout.buttonHeight,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  content: {
    backgroundColor: Colors.backgroundGray,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 36,
    height: 398,
  },
  headerSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.text,
    fontFamily: 'DM Sans',
    lineHeight: 28.8,
  },
  subtitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    fontFamily: 'DM Sans',
    lineHeight: 24,
  },
  formSection: {
    gap: Spacing.medium,
    marginBottom: 20,
  },
  inputContainer: {
    gap: Spacing.gap,
  },
  inputLabel: {
    fontSize: Typography.subheading,
    fontWeight: Typography.bold,
    color: Colors.text,
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  inputField: {
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 14,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  emailText: {
    flex: 1,
    fontSize: Typography.body,
    fontWeight: Typography.regular,
    color: Colors.text,
    fontFamily: 'Work Sans',
    lineHeight: 19.2,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body,
    fontWeight: Typography.regular,
    color: Colors.text,
    fontFamily: 'Work Sans',
    paddingVertical: 0,
  },
  emailIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emailIcon: {
    width: 15.8334,
    height: 13.3334,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    backgroundColor: Colors.transparent,
    position: 'absolute',
    top: 3.9173,
  },
  emailTriangle: {
    position: 'absolute',
    top: 5.58396,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 5,
    borderLeftColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderTopColor: Colors.text,
  },
  sendResetButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendResetButtonDisabled: {
    opacity: 0.6,
  },
  sendResetButtonText: {
    color: Colors.white,
    fontSize: Typography.subheading,
    fontWeight: Typography.bold,
    textAlign: 'center',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: Typography.body,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
    textAlign: 'center',
  },
  loginRegularText: {
    fontWeight: Typography.regular,
    color: Colors.text,
  },
  loginLink: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
});

export default ForgotPasswordScreen;