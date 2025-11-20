import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, TextInput,
  Alert, ActivityIndicator, Image, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetPassword as apiResetPassword } from '../api/authAPI';

const GREEN = '#0F7B5E';
const YELLOW = '#F2B23D';
const PATTERN_TINT = '#FFE2B5';
const BORDER = '#E6E6E6';
const PLACEHOLDER = '#9A9A9A';
const TEXT = '#1A1A1A';
const TEXT_2 = '#4E4E4E';
const SHEET_RADIUS = 28;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get token from navigation params
  const token = route.params?.token || '';

  const handleReset = async () => {
    // Validate token
    if (!token) {
      Alert.alert('Error', 'Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    // Validate password
    if (!password || password.trim().length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    // Validate password match
    if (password !== confirm) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      console.log('🔑 Resetting password with token');

      // Call actual backend reset password API
      const result = await apiResetPassword(token, password);

      if (result && result.success) {
        console.log('✅ Password reset successful');

        Alert.alert(
          'Success!',
          result.message || 'Password reset successfully. Please login with your new password.',
          [
            {
              text: 'Login',
              onPress: () => navigation.navigate('Login' as never),
            },
          ]
        );
      } else {
        throw new Error(result?.message || 'Failed to reset password');
      }
    } catch (e: any) {
      console.error('❌ Reset password error:', e);

      let errorMessage = 'Failed to reset password. Please try again.';

      if (e.message) {
        if (e.message.includes('Invalid or expired token')) {
          errorMessage = 'Reset link has expired. Please request a new password reset link.';
        } else if (e.message.includes('Token not found')) {
          errorMessage = 'Invalid reset token. Please request a new password reset link.';
        } else if (e.message.includes('Network Error') || e.message.includes('network')) {
          errorMessage = 'Cannot connect to server. Please check:\n• Backend is running\n• Device is connected to WiFi';
        } else if (e.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server is not responding.';
        } else {
          errorMessage = e.message;
        }
      }

      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={YELLOW} />

      {/* header + pattern */}
      <View style={styles.header}>
        <Image source={require('../images/homepage-assets/cart-home1.png')} style={[styles.cart, styles.cart1]} />
        <Image source={require('../images/homepage-assets/cart-home2.png')} style={[styles.cart, styles.cart2]} />
        <Image source={require('../images/homepage-assets/cart-home3.png')} style={[styles.cart, styles.cart3]} />
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <View style={styles.arrowContainer}><View style={styles.arrowLine} /><View style={styles.arrowHead} /></View>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Privacy</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* sheet */}
      <View style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>Create a strong, memorable password.</Text>

            <Text style={styles.label}>Password</Text>
            <View style={styles.field}>
              <Image source={require('../images/homepage-assets/lock.png')} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!show1}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShow1(!show1)}>
                <Image source={require('../images/homepage-assets/eye.png')} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
            <View style={styles.field}>
              <Image source={require('../images/homepage-assets/lock.png')} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!show2}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShow2(!show2)}>
                <Image source={require('../images/homepage-assets/eye.png')} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, loading && { opacity: 0.6 }]} onPress={handleReset} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.primaryText}>Reset Password</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginMuted}>Remember your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW },

  header: { flex: 1, backgroundColor: YELLOW, position: 'relative' },
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
  topTitle: { color: '#FFF7E6', fontSize: 17, fontWeight: Platform.select({ ios: '600', android: '700' }) as any },

  cart: { position: 'absolute', opacity: 0.18, tintColor: PATTERN_TINT },
  cart1: { width: 300, height: 300, top: 50, left: -98, transform: [{ rotate: '-18deg' }] },
  cart2: { width: 260, height: 260, top: 295, right: -78, transform: [{ rotate: '24deg' }] },
  cart3: { width: 200, height: 200, top: 162, right: -20, transform: [{ rotate: '-10deg' }] },

  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 26 + (Platform.OS === 'ios' ? 8 : 0),
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 10,
  },
  grabber: { alignSelf: 'center', width: 46, height: 4, borderRadius: 2, backgroundColor: '#E9E9E9', marginBottom: 14 },

  title: { fontSize: 18, fontWeight: '700', color: TEXT, marginBottom: 6 },
  subtitle: { fontSize: 14, color: TEXT_2, marginBottom: 16 },

  label: { fontSize: 13, color: '#3B3B3B', marginBottom: 6 },

  field: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', paddingRight: 12, marginBottom: 10,
  },
  leftIcon: { width: 18, height: 18, marginLeft: 12, marginRight: 8, tintColor: '#6B6B6B', resizeMode: 'contain' },
  input: { flex: 1, height: 48, paddingHorizontal: 2, color: TEXT },
  eyeBtn: { paddingLeft: 6, paddingVertical: 8, paddingRight: 2 },
  eyeIcon: { width: 18, height: 18, tintColor: '#6B6B6B', resizeMode: 'contain' },

  primaryBtn: {
    height: 50, borderRadius: 10, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 6 },
  loginMuted: { color: '#7A7A7A', fontSize: 13 },
  loginLink: { color: GREEN, fontSize: 13, fontWeight: '700' },
});

export default ResetPasswordScreen;
