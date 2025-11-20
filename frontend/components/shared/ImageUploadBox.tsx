import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface ImageUploadBoxProps {
  label?: string;
  imageUri?: string;
  onPress: () => void;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({ label, imageUri, onPress }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={40} color={Colors.textLight} />
            <Text style={styles.placeholderText}>Tap to upload image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.medium,
  },
  label: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.medium,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: Typography.bodySmall,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.medium,
  },
});

export default ImageUploadBox;
