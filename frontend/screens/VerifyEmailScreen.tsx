import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyEmail as apiVerifyEmail } from '../api/verifyEmail';

const GREEN = '#0F7B5E';
const YELLOW = '#F2B23D';

const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get token from navigation params
  const token = route.params?.token || '';

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    } else {
      setLoading(false);
      setError('Invalid verification link');
    }
  }, [token]);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      console.log('🔐 Verifying email with token');

      const result = await apiVerifyEmail(token);

      if (result && result.success) {
        console.log('✅ Email verification successful');
        setSuccess(true);
        setError('');
      } else {
        throw new Error(result?.message || 'Verification failed');
      }
    } catch (e: any) {
      console.error('❌ Email verification error:', e);

      let errorMessage = 'Verification failed. Please try again.';

      if (e.message) {
        if (e.message.includes('Invalid or expired')) {
          errorMessage = 'This verification link has expired or is invalid. Please register again or contact support.';
        } else if (e.message.includes('already verified')) {
          errorMessage = 'Your email is already verified. You can login now.';
          setSuccess(true);
        } else {
          errorMessage = e.message;
        }
      }

      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={success ? GREEN : YELLOW} />

      {/* Header with background */}
      <ImageBackground
        source={require('../images/homepage-assets/welcome.png')}
        style={[styles.header, { backgroundColor: success ? GREEN : YELLOW }]}
        resizeMode="cover"
      >
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <Text style={styles.topTitle}>Email Verification</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Content Sheet */}
      <View style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.content}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={GREEN} />
                <Text style={styles.title}>Verifying your email...</Text>
                <Text style={styles.subtitle}>Please wait while we verify your email address.</Text>
              </>
            ) : success ? (
              <>
                <View style={styles.iconContainer}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>
                <Text style={styles.title}>Email Verified!</Text>
                <Text style={styles.subtitle}>
                  Your email has been successfully verified. You can now login to your account and start shopping.
                </Text>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryText}>Go to Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconContainer}>
                  <Text style={styles.errorIcon}>✕</Text>
                </View>
                <Text style={styles.title}>Verification Failed</Text>
                <Text style={styles.subtitle}>{error}</Text>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => navigation.navigate('SignUp')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.secondaryText}>Back to Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.textButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.textButtonText}>Go to Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const SHEET_RADIUS = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GREEN },

  header: { flex: 1, position: 'relative' },
  safeTop: { flex: 1 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, paddingHorizontal: 16 },
  topTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: Platform.select({ ios: '600', android: '700' }) as any },

  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 26 + (Platform.OS === 'ios' ? 12 : 0),
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 10,
    minHeight: 400,
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  successIcon: {
    fontSize: 48,
    color: GREEN,
    fontWeight: 'bold',
  },

  errorIcon: {
    fontSize: 48,
    color: '#EF4444',
    fontWeight: 'bold',
  },

  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#4E4E4E', marginBottom: 24, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },

  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  secondaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },

  textButton: {
    paddingVertical: 12,
  },
  textButtonText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VerifyEmailScreen;
