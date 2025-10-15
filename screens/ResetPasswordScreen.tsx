import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { resetPassword } from '../api/authAPI';

type ResetPasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordNavigationProp>();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!token.trim()) {
      Alert.alert('Validation Error', 'Please enter the reset token you received via email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter a new password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token.trim(), password);

      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Password reset successfully! You can now login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Reset Failed',
        error.message || 'Unable to reset password. Please check your token and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      
      {/* Yellow/Orange Header */}
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
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter the token from your email and create a new password.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Token Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reset Token</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter reset token"
                    placeholderTextColor="#94A3B8"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.lockContainer}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter new password"
                    placeholderTextColor="#94A3B8"
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputField}>
                <View style={styles.inputContent}>
                  <View style={styles.lockContainer}>
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm new password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <View style={styles.eyeContainer}>
                      <View style={styles.eyeOuter} />
                      <View style={styles.eyeInner} />
                      {!showConfirmPassword && <View style={styles.eyeSlash} />}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.resetButton, loading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#F1F5F9" size="small" />
            ) : (
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              <Text style={styles.loginRegularText}>Remember your password? </Text>
              <Text style={styles.loginLink} onPress={handleLogin}>Login</Text>
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
    backgroundColor: '#F59E0B',
  },
  header: {
    backgroundColor: '#F59E0B',
    paddingBottom: 200,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    height: 56,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11.667,
    paddingHorizontal: 10,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowLine: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
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
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  contentWrapper: {
    marginTop: -150,
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
  },
  headerSection: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 28.8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    fontFamily: 'DM Sans',
    lineHeight: 20.8,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
  },
  inputField: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor: 'transparent',
    borderWidth: 1.66667,
    borderColor: '#000000',
    borderBottomWidth: 0,
    borderRadius: 4.16667,
  },
  lockBody: {
    position: 'absolute',
    top: 9.16669,
    left: 2.5,
    width: 15,
    height: 9.16667,
    backgroundColor: 'transparent',
    borderWidth: 1.66667,
    borderColor: '#000000',
    borderRadius: 1,
  },
  passwordDots: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 3,
    height: 6,
    borderRadius: 1.5,
    backgroundColor: '#334155',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    fontFamily: 'DM Sans',
    paddingVertical: 0,
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
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  eyeInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
  },
  eyeSlash: {
    position: 'absolute',
    top: 3,
    left: -2,
    width: 24,
    height: 2,
    backgroundColor: '#334155',
    transform: [{ rotate: '45deg' }],
  },
  resetButton: {
    backgroundColor: '#026A49',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'DM Sans',
    lineHeight: 21.6,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    lineHeight: 19.2,
    textAlign: 'center',
  },
  loginRegularText: {
    fontWeight: '400',
    color: '#334155',
  },
  loginLink: {
    fontWeight: '600',
    color: '#009D66',
  },
});

export default ResetPasswordScreen;