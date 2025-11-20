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
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword as apiForgotPassword } from '../api/authAPI';

const { width } = Dimensions.get('window');

const GREEN = '#0F7B5E';
const MINT_TINT = '#D4F1E8';
const BORDER = '#E6E6E6';
const TEXT = '#1A1A1A';
const TEXT_2 = '#515151';
const PLACEHOLDER = '#9A9A9A';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigation.goBack();
  const handleLogin = () => navigation.navigate('Login');

  const handleSendResetLink = async () => {
    // Validate email
    if (!email || !email.trim()) {
      return Alert.alert('Validation Error', 'Please enter your email address');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address');
    }

    setLoading(true);

    try {
      console.log('📧 Requesting password reset for:', email.trim());

      // Call actual backend forgot password API
      const result = await apiForgotPassword(email.trim());

      if (result && result.success) {
        console.log('✅ Reset link sent successfully');

        // In development, backend returns token for testing
        const token = result.token || '';

        Alert.alert(
          'Success!',
          result.message || 'Password reset link sent to your email',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to reset password screen with token (for development)
                if (token) {
                  navigation.navigate('ResetPassword', { token });
                } else {
                  // In production, user would get email with link
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else {
        throw new Error(result?.message || 'Failed to send reset link');
      }
    } catch (e: any) {
      console.error('❌ Forgot password error:', e);

      let errorMessage = 'Unable to send reset link. Please try again.';

      if (e.message) {
        if (e.message.includes('User not found') || e.message.includes('No user found')) {
          errorMessage = 'No account found with this email address.';
        } else if (e.message.includes('Network Error') || e.message.includes('network')) {
          errorMessage = 'Cannot connect to server. Please check:\n• Backend is running\n• Device is connected to WiFi';
        } else if (e.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server is not responding.';
        } else {
          errorMessage = e.message;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* GREEN HEADER + CART PATTERN */}
      <View style={styles.header}>
        <Image source={require('../images/homepage-assets/cart-home1.png')} style={[styles.cart, styles.cart1]} />
        <Image source={require('../images/homepage-assets/cart-home2.png')} style={[styles.cart, styles.cart2]} />
        <Image source={require('../images/homepage-assets/cart-home3.png')} style={[styles.cart, styles.cart3]} />

        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
              <View style={styles.arrowContainer}>
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Privacy</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* WHITE SHEET (rounded, like mock) */}
      <View style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we’ll send a link to reset your password.
            </Text>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              {/* envelope built from shapes for 1:1 with mock */}
              <View style={styles.envelopeBox}>
                <View style={styles.envelopeRect} />
                <View style={styles.envelopeFlap} />
              </View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={handleSendResetLink}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginMuted}>Remember your password? </Text>
              <TouchableOpacity onPress={handleLogin}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const SHEET_RADIUS = 40;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GREEN },

  header: { flex: 1, backgroundColor: GREEN, position: 'relative' },
  safeTop: { flex: 1 },

  topBar: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  arrowContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  arrowLine: { position: 'absolute', left: 6, width: 14, height: 2.4, backgroundColor: '#FFFFFF', borderRadius: 1.2 },
  arrowHead: {
    position: 'absolute', left: 3, width: 0, height: 0,
    borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 9,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#FFFFFF',
  },
  topTitle: { color: '#EAF7F2', fontSize: 17, fontWeight: Platform.select({ ios: '600', android: '700' }) as any },

  // CARTS — scaled/placed like your screenshot
  cart: { position: 'absolute', opacity: 0.20, tintColor: MINT_TINT },
  cart1: { width: 300, height: 300, top: 60, left: -108, transform: [{ rotate: '-18deg' }] },
  cart2: { width: 260, height: 260, top: 316, right: -86, transform: [{ rotate: '24deg' }] },
  cart3: { width: 200, height: 200, top: 182, right: -18, transform: [{ rotate: '-10deg' }] },

  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    width,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 26 + (Platform.OS === 'ios' ? 12 : 0),
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 10,
  },

  title: { fontSize: 20, fontWeight: '700', color: TEXT, marginBottom: 8 },
  subtitle: { fontSize: 14, color: TEXT_2, marginBottom: 18 },

  label: { fontSize: 13, color: '#333', marginBottom: 6 },

  inputRow: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', paddingRight: 12, marginBottom: 16,
  },
  envelopeBox: { width: 22, height: 22, marginLeft: 12, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  envelopeRect: { width: 18, height: 12, borderWidth: 1.4, borderColor: '#6B6B6B', borderRadius: 2, backgroundColor: 'transparent' },
  envelopeFlap: {
    position: 'absolute', top: 6, width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#6B6B6B',
  },
  input: { flex: 1, height: 50, paddingHorizontal: 2, color: TEXT },

  primaryBtn: {
    height: 52, borderRadius: 12, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  loginMuted: { color: '#777', fontSize: 13 },
  loginLink: { color: GREEN, fontSize: 13, fontWeight: '700' },
});

export default ForgotPasswordScreen;
