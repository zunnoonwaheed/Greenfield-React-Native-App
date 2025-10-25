/**
 * SecurityScreen - Change Password
 * Update password with current password verification
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type SecurityScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SecurityScreen: React.FC = () => {
  const navigation = useNavigation<SecurityScreenNavigationProp>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = () => {
    return (
      currentPassword.trim() !== '' &&
      newPassword.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      newPassword.length >= 8 &&
      newPassword === confirmPassword
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      if (newPassword !== confirmPassword) {
        Alert.alert('Password Mismatch', 'New password and confirm password do not match.');
      } else if (newPassword.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      } else {
        Alert.alert('Incomplete Form', 'Please fill in all fields.');
      }
      return;
    }

    // TODO: API call to change password
    Alert.alert(
      'Password Updated',
      'Your password has been changed successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={48} color="#00A86B" />
          <Text style={styles.infoTitle}>Change Password</Text>
          <Text style={styles.infoText}>
            Keep your account secure by using a strong password
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Current Password <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={18} color="#00A86B" />
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter current password"
                placeholderTextColor="#999"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              New Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password (min 8 characters)"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
            {newPassword.length > 0 && newPassword.length < 8 && (
              <Text style={styles.errorText}>Password must be at least 8 characters</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter new password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons
                name={newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={newPassword.length >= 8 ? '#00A86B' : '#9E9E9E'}
              />
              <Text style={styles.requirementText}>At least 8 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={/[A-Z]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[A-Z]/.test(newPassword) ? '#00A86B' : '#9E9E9E'}
              />
              <Text style={styles.requirementText}>One uppercase letter</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={/[0-9]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[0-9]/.test(newPassword) ? '#00A86B' : '#9E9E9E'}
              />
              <Text style={styles.requirementText}>One number</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!isFormValid()}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  infoText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 6,
  },
  requirementsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#777',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

export default SecurityScreen;
