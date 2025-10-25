/**
 * CustomButton - Reusable Button Component
 * Active/Inactive states with consistent styling
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isPrimary ? '#FFFFFF' : '#00A86B'} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isPrimary ? styles.primaryText : styles.outlineText,
            (disabled || loading) && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#00A86B',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00A86B',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#00A86B',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});

export default CustomButton;
