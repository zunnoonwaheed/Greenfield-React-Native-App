// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { login as apiLogin } from '../api/authAPI';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosConfig';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const GREEN = '#0F7B5E';
const ORANGE = '#E9723B';
const ORANGE_TINT = '#FFD6C3';
const FIELD_BORDER = '#E6E6E6';
const PLACEHOLDER = '#9A9A9A';
const TEXT_DARK = '#1A1A1A';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (loading) {
      return;
    }

    // Validate input fields
    if (!email || !email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return;
    }

    if (!password || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Logging in user:', email.trim());

      // NOTE: apiLogin stores auth token automatically, but we need to check addresses FIRST
      // So we'll let it login, then check addresses before triggering AuthContext
      const result = await apiLogin(email.trim(), password);

      if (result && result.success) {
        console.log('✅ Backend login successful:', result.user?.email);
        console.log('⚠️ Note: Auth token stored, but NOT triggering AuthContext yet');

        // Check if user has saved addresses
        try {
          const addressResponse = await axiosInstance.get('/api/addresses.php');
          console.log('📍 Addresses response:', addressResponse);

          // If user has no addresses, navigate to AddLocation screen
          if (!addressResponse.success || !addressResponse.data?.addresses || addressResponse.data.addresses.length === 0) {
            console.log('📍 No addresses found - navigating to AddLocation');
            console.log('📍 User will add address, then auth will complete');
            navigation.navigate('AddLocation');
          } else {
            // User has addresses - trigger AuthContext to switch to MainStack
            console.log('📍 User has addresses - triggering AuthContext');
            await authLogin('logged_in', result.user || { email: email.trim() });
            // Navigation will happen automatically via AuthContext switching to MainStack
          }
        } catch (addressError) {
          console.error('⚠️ Error checking addresses:', addressError);
          // If error checking addresses, assume no addresses and navigate to AddLocation
          navigation.navigate('AddLocation');
        }
      } else {
        throw new Error(result?.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);

      let errorMessage = 'Login failed. Please try again.';
      let showSignupOption = false;

      if (error.message) {
        if (error.message.includes('Invalid password')) {
          errorMessage = 'Invalid password. Please check your password and try again.';
        } else if (error.message.includes('No account found') || error.message.includes('Please sign up first')) {
          errorMessage = 'No account found with this email address.';
          showSignupOption = true;
        } else if (error.message.includes('User not found')) {
          errorMessage = 'No account found with this email address.';
          showSignupOption = true;
        } else if (error.message.includes('Network Error') || error.message.includes('network')) {
          errorMessage = 'Cannot connect to server. Please check:\n• Backend is running on port 8000\n• Device is connected to WiFi\n• IP address is correct (192.168.100.136)';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server is not responding.';
        } else {
          errorMessage = error.message;
        }
      }

      // Show alert with signup option if user doesn't exist
      if (showSignupOption) {
        Alert.alert(
          '❌ Account Not Found',
          errorMessage + '\n\nWould you like to create an account?',
          [
            {
              text: 'Try Again',
              style: 'cancel',
              onPress: () => {
                // Clear fields so user can try different email
                setEmail('');
                setPassword('');
              }
            },
            {
              text: 'Sign Up',
              onPress: () => navigation.navigate('SignUp'),
            },
          ]
        );
      } else {
        // For wrong password, offer to try again or reset
        const isPasswordError = errorMessage.includes('Invalid password') || errorMessage.includes('password');

        if (isPasswordError) {
          Alert.alert(
            '❌ Login Failed',
            errorMessage,
            [
              {
                text: 'Try Again',
                style: 'cancel',
                onPress: () => {
                  // Clear only password field
                  setPassword('');
                }
              },
              {
                text: 'Forgot Password?',
                onPress: () => navigation.navigate('ForgotPassword'),
              },
            ]
          );
        } else {
          Alert.alert('❌ Login Failed', errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const onForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ORANGE} />

      {/* HEADER WITH BACKGROUND IMAGE */}
      <ImageBackground
        source={require('../images/homepage-assets/login-location.png')}
        style={styles.header}
        resizeMode="cover"
      >
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <View style={styles.arrowContainer}>
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Privacy</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* SHEET */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.heroTitle}>Get everything in one place.</Text>
            <Text style={styles.heroCopy}>
              Logging in means faster checkout, tracked orders, and exclusive bundle deals
            </Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.fieldRow}>
              <Image
                source={require('../images/homepage-assets/mailbox.png')}
                style={styles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Anthonyjack@gmail.com"
                placeholderTextColor={PLACEHOLDER}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
            <View style={styles.fieldRow}>
              <Image
                source={require('../images/homepage-assets/lock.png')}
                style={styles.leftIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                secureTextEntry={!pwVisible}
                editable={!loading}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setPwVisible(!pwVisible)}>
                <Image
                  source={require('../images/homepage-assets/eye.png')}
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={onForgotPassword}
              activeOpacity={0.8}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={onLogin}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9}>
              <Image
                source={require('../images/homepage-assets/google-logo.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity style={[styles.socialBtn, { marginTop: 10 }]} activeOpacity={0.9}>
              <Image
                source={require('../images/homepage-assets/apple-logo.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Sign in with Apple</Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignup}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const SHEET_RADIUS = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORANGE },

  header: { flex: 1, backgroundColor: ORANGE, position: 'relative' },
  safeTop: { flex: 1 },

  topBar: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  arrowContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  arrowLine: { position: 'absolute', left: 6, width: 14, height: 2.4, backgroundColor: '#FFFFFF', borderRadius: 1.2 },
  arrowHead: {
    position: 'absolute',
    left: 3,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  topTitle: { color: '#FFF4EE', fontSize: 17, fontWeight: Platform.select({ ios: '600', android: '700' }) as any },

  // Sheet
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 26 + (Platform.OS === 'ios' ? 8 : 0),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 10,
  },
  grabber: { alignSelf: 'center', width: 46, height: 4, borderRadius: 2, backgroundColor: '#E9E9E9', marginBottom: 14 },

  heroTitle: { fontSize: 20, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  heroCopy: { fontSize: 14, color: '#4E4E4E', marginBottom: 16 },

  label: { fontSize: 13, color: '#3B3B3B', marginBottom: 6 },

  fieldRow: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    marginBottom: 6,
  },
  leftIcon: { width: 18, height: 18, marginLeft: 12, marginRight: 8, tintColor: '#6B6B6B' },
  input: { flex: 1, height: 48, paddingHorizontal: 2, color: TEXT_DARK },
  eyeBtn: { paddingLeft: 6, paddingVertical: 8, paddingRight: 2 },
  eyeIcon: { width: 18, height: 18, tintColor: '#6B6B6B' },

  forgotWrap: { alignSelf: 'flex-end', marginTop: 6, marginBottom: 10 },
  forgotText: { color: GREEN, fontSize: 13, fontWeight: '600' },

  primaryBtn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 10 },
  divider: { flex: 1, height: 1, backgroundColor: '#E7E7E7' },
  dividerText: { fontSize: 12, color: '#7A7A7A' },

  socialBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  socialIcon: { width: 18, height: 18, marginRight: 8 },
  socialText: { color: '#2C2C2C', fontSize: 15, fontWeight: '600' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 8 },
  signupText: { color: '#7A7A7A', fontSize: 13 },
  signupLink: { color: GREEN, fontSize: 13, fontWeight: '700' },
});

export default LoginScreen;