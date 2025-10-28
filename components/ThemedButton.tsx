/**
 * ThemedButton - Centralized Button Component
 * Provides consistent styling across the entire app
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  type?: 'solid' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  type = 'solid',
  fullWidth = true,
  disabled = false,
  loading = false,
}) => {
  const isSolid = type === 'solid';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSolid ? styles.solidButton : styles.outlineButton,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? Colors.textWhite : Colors.primary} />
      ) : (
        <Text style={[styles.buttonText, isSolid ? styles.solidText : styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  solidButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    fontFamily: 'Poppins',
  },
  solidText: {
    color: Colors.textWhite,
  },
  outlineText: {
    color: Colors.primary,
  },
});

export default ThemedButton;
