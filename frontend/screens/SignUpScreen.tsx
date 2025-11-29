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
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signup as apiSignup } from '../api/authAPI';
import { useAuth } from '../contexts/AuthContext';

const GREEN = '#0F7B5E';
const MINT_TINT = '#D4F1E8';
const BORDER = '#E6E6E6';
const TEXT = '#1A1A1A';
const TEXT_2 = '#515151';
const PLACEHOLDER = '#9A9A9A';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login: authLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigation.goBack();
  const handleLogin = () => navigation.navigate('Login');

  const handleSignup = async () => {
    // Validate terms agreement
    if (!agree) {
      return Alert.alert('Agree to terms', 'Please accept the Terms and Privacy Policy to continue.');
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return Alert.alert('Validation Error', 'Please enter your name');
    }

    if (!email || !email.trim()) {
      return Alert.alert('Validation Error', 'Please enter your email address');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address');
    }

    if (!phone || !phone.trim()) {
      return Alert.alert('Validation Error', 'Please enter your phone number');
    }

    // Basic phone validation (11 digits for Pakistan format)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return Alert.alert('Invalid Phone', 'Please enter a valid phone number');
    }

    if (!password || password.trim().length < 6) {
      return Alert.alert('Validation Error', 'Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      console.log('📝 Registering user:', email.trim());

      // Call actual backend signup API
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        phone: phoneDigits.startsWith('0') ? phoneDigits : '0' + phoneDigits,
        city: 'Islamabad',
        phase: 'DHA Phase 2',
        sector: 'Sector A',
        street: '1',
        type: 'House',
        house_number: '1',
      };

      const result = await apiSignup(userData);

      if (result && result.success) {
        console.log('✅ Registration successful');

        // Show success message and navigate to login
        Alert.alert(
          '🎉 Account Created!',
          `Welcome ${name.trim()}! Your account has been created successfully.\n\nPlease login with your email and password to continue.`,
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        throw new Error(result?.message || 'Registration failed');
      }
    } catch (e: any) {
      console.error('❌ Signup error:', e);

      let errorMessage = 'Unable to create account. Please try again.';
      let showLoginOption = false;

      if (e.message) {
        if (e.message.includes('Email already registered') || e.message.includes('already exists')) {
          errorMessage = 'This email is already registered.';
          showLoginOption = true;
        } else if (e.message.includes('All fields are required')) {
          errorMessage = 'Please fill in all required fields.';
        } else if (e.message.includes('Network Error') || e.message.includes('network')) {
          errorMessage = 'Cannot connect to server. Please check:\n• Backend is running on port 8000\n• Device is connected to WiFi\n• IP address is correct';
        } else if (e.message.includes('timeout')) {
          errorMessage = 'Request timeout. Server is not responding.';
        } else {
          errorMessage = e.message;
        }
      }

      // Show alert with login option if email already exists
      if (showLoginOption) {
        Alert.alert(
          '❌ Email Already Exists',
          errorMessage + '\n\nWould you like to login instead?',
          [
            {
              text: 'Try Again',
              style: 'cancel',
              onPress: () => {
                // Clear email field so user can enter different email
                setEmail('');
              }
            },
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('❌ Signup Failed', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* GREEN HEADER WITH BACKGROUND IMAGE */}
      <ImageBackground
        source={require('../images/homepage-assets/auth-signup-screen.png')}
        style={styles.header}
        resizeMode="cover"
      >
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
      </ImageBackground>

      {/* WHITE SHEET */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Join now and shop the smart way.</Text>
            <Text style={styles.subtitle}>
              Track orders, save bundles, post ads, and enjoy fast checkout.
            </Text>

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
              <Image source={require('../images/homepage-assets/profile.png')} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Anthony Jack"
                placeholderTextColor={PLACEHOLDER}
              />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 10 }]}>Email</Text>
            <View style={styles.inputRow}>
              {/* envelope icon via shapes to match the mock */}
              <View style={styles.envelopeBox}>
                <View style={styles.envelopeRect} />
                <View style={styles.envelopeFlap} />
              </View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Anthonyjack@gmail.com"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Phone */}
            <Text style={[styles.label, { marginTop: 10 }]}>Phone</Text>
            <View style={styles.inputRow}>
              <Image source={require('../images/homepage-assets/phone.png')} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="03001234567"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
            <View style={styles.inputRow}>
              <Image source={require('../images/homepage-assets/lock.png')} style={styles.leftIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPw(!showPw)}>
                <Image source={require('../images/homepage-assets/eye.png')} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} activeOpacity={0.8} onPress={() => setAgree(!agree)}>
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && (
                  <>
                    <View style={styles.checkLeft} />
                    <View style={styles.checkRight} />
                  </>
                )}
              </View>
              <Text style={styles.termsText}>
                By signing up, you agree to our <Text style={styles.link}>[Terms]</Text> and <Text style={styles.link}>[Privacy Policy]</Text>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 8 }, !agree && { opacity: 0.5 }]}
              onPress={handleSignup}
              disabled={!agree || loading}
              activeOpacity={0.9}
            >
              {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.primaryText}>Sign up</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginMuted}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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

  // SHEET
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
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
    flexDirection: 'row', alignItems: 'center', paddingRight: 12, marginBottom: 12,
  },
  leftIcon: { width: 18, height: 18, marginLeft: 12, marginRight: 8, tintColor: '#6B6B6B', resizeMode: 'contain' },

  // Envelope (for Email)
  envelopeBox: { width: 22, height: 22, marginLeft: 12, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  envelopeRect: { width: 18, height: 12, borderWidth: 1.4, borderColor: '#6B6B6B', borderRadius: 2, backgroundColor: 'transparent' },
  envelopeFlap: {
    position: 'absolute', top: 6, width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#6B6B6B',
  },

  input: { flex: 1, height: 50, paddingHorizontal: 2, color: TEXT },
  eyeBtn: { paddingLeft: 6, paddingVertical: 8, paddingRight: 2 },
  eyeIcon: { width: 18, height: 18, tintColor: '#6B6B6B', resizeMode: 'contain' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, marginBottom: 14 },
  checkbox: {
    width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: GREEN, marginRight: 10, marginTop: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: GREEN, borderColor: GREEN },
  checkLeft: { position: 'absolute', width: 2, height: 8, backgroundColor: '#fff', left: 5, top: 8, transform: [{ rotate: '-45deg' }] },
  checkRight: { position: 'absolute', width: 2, height: 13, backgroundColor: '#fff', left: 9, top: 3, transform: [{ rotate: '45deg' }] },
  termsText: { flex: 1, fontSize: 12.5, color: TEXT_2, lineHeight: 18 },
  link: { color: GREEN, fontWeight: '600' },

  primaryBtn: {
    height: 52, borderRadius: 12, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 6 },
  loginMuted: { color: '#777', fontSize: 13 },
  loginLink: { color: GREEN, fontSize: 13, fontWeight: '700' },
});

export default SignUpScreen;
