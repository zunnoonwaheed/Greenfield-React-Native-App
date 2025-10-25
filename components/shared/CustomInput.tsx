/**
 * CustomInput - Reusable Input Component
 * Consistent styling across Create Ad flow
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
});

export default CustomInput;
