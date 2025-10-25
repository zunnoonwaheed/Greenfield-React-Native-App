/**
 * ImageUploadBox - Image upload placeholder component
 * Dashed border with camera icon
 */

import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImageUploadBoxProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  index: number;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  imageUri,
  onImageSelected,
  index,
}) => {
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePickImage}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={32} color="#9E9E9E" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
});

export default ImageUploadBox;
