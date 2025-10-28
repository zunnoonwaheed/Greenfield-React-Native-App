import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { login } from '../api/authAPI';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

const { width } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
}) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
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
      console.log('🔐 Attempting login for:', email.trim());
      const response = await login(email.trim(), password);

      console.log('📥 Login response received:', {
        success: response?.success,
        hasToken: !!response?.token,
        hasUser: !!response?.user,
        message: response?.message
      });

      if (response.success && response.token && response.user) {
        // Update auth context - this will automatically navigate to MainStack
        await authLogin(response.token, response.user);

        console.log('✅ Login successful - switching to Main App');
      } else {
        console.warn('⚠️ Login response missing required fields:', response);
        Alert.alert(
          'Login Failed',
          response?.message || 'Invalid response from server. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'Unable to login. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} />
      
      {/* Orange Header */}
      <View style={styles.header}>
        <SafeAreaView>
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
      </View>

      {/* Main content container */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Get everything in one place.</Text>
            <Text style={styles.subtitle}>
              Logging in means faster checkout, tracked orders, and exclusive bundle deals
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.lockContainer}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <View style={styles.eyeContainer}>
                      <View style={styles.eyeOuter} />
                      <View style={styles.eyeInner} />
                      {!showPassword && <View style={styles.eyeSlash} />}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textWhite} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              <Text style={styles.signUpRegularText}>Don't have an account? </Text>
              <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>Sign up</Text>
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
    backgroundColor: Colors.accent,
  },
  header: {
    backgroundColor: Colors.accent,
    paddingBottom: 150,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.small,
    height: 56,
  },
  backButton: {
    width: 48,
    height: 48,
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
    width: 48,
    height: 48,
  },
  contentWrapper: {
    marginTop: -100,
    paddingHorizontal: Spacing.screenPadding,
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl * 1.7,
    borderTopRightRadius: BorderRadius.xl * 1.7,
    borderBottomLeftRadius: BorderRadius.xl * 1.7,
    borderBottomRightRadius: BorderRadius.xl * 1.7,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.xl,
    paddingBottom: 36,
  },
  headerSection: {
    marginBottom: Spacing.large,
    gap: Spacing.small,
  },
  title: {
    fontSize: Typography.heading,
    fontWeight: Typography.bold,
    color: Colors.text,
    fontFamily: 'DM Sans',
    lineHeight: 28.8,
  },
  subtitle: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    fontFamily: 'DM Sans',
    lineHeight: 20.8,
  },
  formSection: {
    gap: Spacing.medium,
    marginBottom: Spacing.large,
  },
  inputContainer: {
    gap: Spacing.small,
  },
  inputLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
  },
  inputField: {
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontWeight: Typography.medium,
    color: Colors.text,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.text,
    fontFamily: 'DM Sans',
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
  lockContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockShackle: {
    position: 'absolute',
    top: 1.66667,
    left: 5.83333,
    width: 8.33334,
    height: 7.5,
    backgroundColor: Colors.transparent,
    borderWidth: 1.66667,
    borderColor: Colors.black,
    borderBottomWidth: 0,
    borderRadius: 4.16667,
  },
  lockBody: {
    position: 'absolute',
    top: 9.16669,
    left: 2.5,
    width: 15,
    height: 9.16667,
    backgroundColor: Colors.transparent,
    borderWidth: 1.66667,
    borderColor: Colors.black,
    borderRadius: 1,
  },
  passwordDots: {
    flexDirection: 'row',
    gap: Spacing.small,
    flex: 1,
  },
  dot: {
    width: 3,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: Colors.text,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeContainer: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  eyeOuter: {
    position: 'absolute',
    top: 5,
    left: 2,
    width: 16,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.text,
    backgroundColor: Colors.transparent,
  },
  eyeInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.text,
  },
  eyeSlash: {
    position: 'absolute',
    top: 3,
    left: -2,
    width: 24,
    height: 2,
    backgroundColor: Colors.text,
    transform: [{ rotate: '45deg' }],
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
  forgotPasswordText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.success,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
  },
  loginButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.input,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.screenPadding,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.h5,
    fontWeight: Typography.semibold,
    textAlign: 'center',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: Typography.body,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
    textAlign: 'center',
  },
  signUpRegularText: {
    fontWeight: Typography.regular,
    color: Colors.text,
  },
  signUpLink: {
    fontWeight: Typography.semibold,
    color: Colors.success,
  },
});

export default LoginScreen;
