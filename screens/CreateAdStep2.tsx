/**
 * CreateAdStep2 - Product-Specific Information
 * Specifications and Product Pictures
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreateAd } from './CreateAdContext';

interface CreateAdStep2Props {
  onNext: () => void;
  onBack: () => void;
}

const CreateAdStep2: React.FC<CreateAdStep2Props> = ({ onNext, onBack }) => {
  const { adData, updateAdData } = useCreateAd();
  const [specInput, setSpecInput] = useState('');

  const handleAddSpecification = () => {
    const trimmed = specInput.trim();
    if (trimmed && !adData.specifications.includes(trimmed)) {
      updateAdData({
        specifications: [...adData.specifications, trimmed],
      });
      setSpecInput('');
    }
  };

  const handleRemoveSpecification = (spec: string) => {
    updateAdData({
      specifications: adData.specifications.filter((s) => s !== spec),
    });
  };

  const handlePickImage = async (index: number) => {
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
      const newImages = [...adData.images];
      newImages[index] = result.assets[0].uri;
      updateAdData({ images: newImages });
    }
  };

  const isFormValid = () => {
    return adData.specifications.length > 0 && adData.images.some((img) => img !== '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Be honest and clear — good descriptions attract more buyers.
        </Text>

        {/* Specifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={20} color="#666" />
            <Text style={styles.sectionLabel}>Specifications</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Text style={styles.hint}>Add key features of your product</Text>

          {/* Input for adding specs */}
          <View style={styles.specInputContainer}>
            <TextInput
              style={styles.specInput}
              placeholder='e.g. "128GB", "Graphite Color"'
              placeholderTextColor="#9E9E9E"
              value={specInput}
              onChangeText={setSpecInput}
              onSubmitEditing={handleAddSpecification}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddSpecification}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={32} color="#00A86B" />
            </TouchableOpacity>
          </View>

          {/* Display added specs */}
          {adData.specifications.length > 0 && (
            <View style={styles.specsContainer}>
              {adData.specifications.map((spec, index) => (
                <View key={index} style={styles.specTag}>
                  <Text style={styles.specText}>{spec}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveSpecification(spec)}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Product Pictures */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera-outline" size={20} color="#666" />
            <Text style={styles.sectionLabel}>Product Pictures</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <Text style={styles.hint}>Add up to 5 photos (first one will be the main photo)</Text>

          <View style={styles.imagesGrid}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageBox}
                onPress={() => handlePickImage(index)}
                activeOpacity={0.7}
              >
                {adData.images[index] ? (
                  <Image
                    source={{ uri: adData.images[index] }}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#9E9E9E" />
                    <Text style={styles.imagePlaceholderText}>
                      {index === 0 ? 'Main Photo' : `Photo ${index + 1}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid() && styles.nextButtonDisabled]}
            onPress={onNext}
            disabled={!isFormValid()}
            activeOpacity={0.8}
          >
            <Text style={[styles.nextButtonText, !isFormValid() && styles.nextButtonTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  specInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  specInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A86B',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  specText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageBox: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00A86B',
    fontFamily: 'Poppins',
  },
  nextButton: {
    flex: 1,
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
  nextButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  nextButtonTextDisabled: {
    color: '#9E9E9E',
  },
});

export default CreateAdStep2;
