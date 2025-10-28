import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { signup } from '../api/authAPI';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { login: authLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }

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

    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the Terms and Privacy Policy to continue');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      };

      console.log('📝 Attempting signup for:', userData.email);
      const response = await signup(userData);

      console.log('📥 Signup response received:', {
        success: response?.success,
        hasToken: !!response?.token,
        hasUser: !!response?.user,
        message: response?.message
      });

      if (response.success && response.token && response.user) {
        // Automatically log user in after successful signup
        await authLogin(response.token, response.user);

        console.log('✅ Signup successful - switching to Main App');
        // User will be redirected to MainStack automatically via AuthContext
      } else {
        console.warn('⚠️ Signup response missing required fields:', response);
        Alert.alert(
          'Signup Failed',
          response?.message || 'Invalid response from server. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      Alert.alert(
        'Sign Up Failed',
        error.message || 'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={Layout.iconSize} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.title}>Join now and shop the smart way.</Text>
            <Text style={styles.subtitle}>
              Track orders, save bundles, post ads, and enjoy fast checkout.
            </Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Anthony Jack"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Anthonyjack@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.textLight}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Ionicons name="checkmark" size={Typography.body} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxText}>
                By signing up, you agree to our{' '}
                <Text style={styles.link}>[Terms]</Text> and{' '}
                <Text style={styles.link}>[Privacy Policy]</Text>.
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  backButton: {
    width: Spacing.xxl,
    height: Spacing.xxl,
    justifyContent: 'center',
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.gap,
    lineHeight: Spacing.xl,
  },
  subtitle: {
    fontSize: Typography.bodySmall + 1,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: Spacing.screenPadding,
  },
  label: {
    fontSize: Typography.bodySmall + 1,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.medium,
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing.gap,
  },
  input: {
    flex: 1,
    fontSize: Typography.bodySmall + 1,
    color: Colors.text,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.small,
    marginBottom: Spacing.large,
  },
  checkbox: {
    width: Spacing.screenPadding,
    height: Spacing.screenPadding,
    borderRadius: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Spacing.gap,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: Typography.caption + 1,
    color: Colors.textSecondary,
    lineHeight: Spacing.screenPadding,
  },
  link: {
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.screenPadding,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Typography.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
});

export default SignUpScreen;