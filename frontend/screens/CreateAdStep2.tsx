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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreateAd } from './CreateAdContext';
import { uploadAdImage } from '../api/marketplaceAPI';

interface CreateAdStep2Props {
  onNext: () => void;
  onBack: () => void;
}

const CreateAdStep2: React.FC<CreateAdStep2Props> = ({ onNext, onBack }) => {
  const { adData, updateAdData } = useCreateAd();
  const [specInput, setSpecInput] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const localUri = result.assets[0].uri;

      // Show the image immediately (local preview)
      const newImages = [...adData.images];
      newImages[index] = localUri;
      updateAdData({ images: newImages });

      // Upload to server in background
      setUploadingIndex(index);
      try {
        const uploadResult = await uploadAdImage(localUri);
        if (uploadResult.success && uploadResult.data?.image_url) {
          // Update with server URL
          const updatedImages = [...adData.images];
          updatedImages[index] = uploadResult.data.image_url;
          updateAdData({ images: updatedImages });
        } else {
          // Keep local URI if upload fails - it will still work for preview
          console.warn('Image upload failed, keeping local URI');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        // Keep local URI on error
      } finally {
        setUploadingIndex(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Specifications</Text>

          {/* Input for adding specs */}
          <View style={styles.specInputContainer}>
            <Image
              source={require('../images/homepage-assets/gem.png')}
              style={styles.inputIconInside}
              resizeMode="contain"
            />
            <TextInput
              style={styles.specInput}
              placeholder="Select or add tags"
              placeholderTextColor="#94A3B8"
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
              <Ionicons name="add-circle" size={28} color="#059669" />
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
          <Text style={styles.sectionLabel}>Product Pictures</Text>

          {adData.images.some((img) => img !== '') ? (
            <View style={styles.imagesRow}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageBoxSmall}
                  onPress={() => handlePickImage(index)}
                  activeOpacity={0.7}
                  disabled={uploadingIndex === index}
                >
                  {adData.images[index] ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: adData.images[index].startsWith('http') || adData.images[index].startsWith('file') || adData.images[index].startsWith('uploads')
                          ? adData.images[index].startsWith('uploads')
                            ? `http://localhost:3000/${adData.images[index]}`
                            : adData.images[index]
                          : adData.images[index] }}
                        style={styles.uploadedImageSmall}
                        resizeMode="cover"
                      />
                      {uploadingIndex === index && (
                        <View style={styles.uploadingOverlay}>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.imagePlaceholderSmall}>
                      <Ionicons name="camera" size={20} color="#94A3B8" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handlePickImage(0)}
              activeOpacity={0.7}
            >
              <Image
                source={require('../images/homepage-assets/camera-add.png')}
                style={styles.cameraAddImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
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
            style={styles.nextButton}
            onPress={onNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'DM Sans',
  },
  specInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  inputIconInside: {
    width: 20,
    height: 20,
    tintColor: '#64748B',
  },
  specInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
    fontFamily: 'DM Sans',
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
    backgroundColor: '#059669',
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
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  imageBoxSmall: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  uploadedImageSmall: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderSmall: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraAddImage: {
    width: '100%',
    height: 60,
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
    borderColor: '#059669',
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
    color: '#059669',
    fontFamily: 'DM Sans',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#059669',
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
    backgroundColor: '#BBF7D0',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
  nextButtonTextDisabled: {
    color: '#FFFFFF',
  },
});

export default CreateAdStep2;
