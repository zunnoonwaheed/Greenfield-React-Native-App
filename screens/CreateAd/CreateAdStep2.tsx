/**
 * CreateAdStep2 - Product-Specific Info
 * Specifications (tags) and Product Pictures
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TagSelector from '../../components/shared/TagSelector';
import ImageUploadBox from '../../components/shared/ImageUploadBox';
import CustomButton from '../../components/shared/CustomButton';

export interface Step2Data {
  specifications: string[];
  images: string[];
}

interface CreateAdStep2Props {
  data: Step2Data;
  onDataChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const CreateAdStep2: React.FC<CreateAdStep2Props> = ({
  data,
  onDataChange,
  onNext,
  onBack,
}) => {
  const updateSpecifications = (specs: string[]) => {
    onDataChange({ ...data, specifications: specs });
  };

  const updateImage = (index: number, uri: string) => {
    const newImages = [...data.images];
    newImages[index] = uri;
    onDataChange({ ...data, images: newImages });
  };

  const isFormValid = () => {
    // At least one specification and one image required
    return data.specifications.length > 0 && data.images.some((img) => img !== '');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Be honest and clear — good descriptions attract more buyers.
          </Text>
        </View>

        {/* Specifications */}
        <TagSelector
          label="Specifications"
          tags={data.specifications}
          onTagsChange={updateSpecifications}
          placeholder='e.g. "128GB", "Graphite Color"'
          required
        />

        {/* Product Pictures */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Product Pictures <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.sectionHint}>Add up to 5 photos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <ImageUploadBox
                key={index}
                imageUri={data.images[index]}
                onImageSelected={(uri) => updateImage(index, uri)}
                index={index}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <CustomButton title="Back" onPress={onBack} variant="outline" />
          </View>
          <View style={styles.buttonHalf}>
            <CustomButton
              title="Next"
              onPress={onNext}
              disabled={!isFormValid()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
  },
  sectionHint: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  imagesContainer: {
    paddingVertical: 8,
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
  buttonHalf: {
    flex: 1,
  },
});

export default CreateAdStep2;
