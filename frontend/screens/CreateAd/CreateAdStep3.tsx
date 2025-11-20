/**
 * CreateAdStep3 - Preview & Publish
 * Review all details before publishing
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import CustomButton from '../../components/shared/CustomButton';
import { Step1Data } from './CreateAdStep1';
import { Step2Data } from './CreateAdStep2';

interface CreateAdStep3Props {
  step1Data: Step1Data;
  step2Data: Step2Data;
  onEdit: () => void;
  onPublish: () => void;
  onBack: () => void;
}

const CreateAdStep3: React.FC<CreateAdStep3Props> = ({
  step1Data,
  step2Data,
  onEdit,
  onPublish,
  onBack,
}) => {
  const getCategoryLabel = (value: string): string => {
    const categories: { [key: string]: string } = {
      electronics: 'Electronics',
      furniture: 'Furniture',
      grocery: 'Grocery',
      vehicles: 'Vehicles',
      clothing: 'Clothing',
      books: 'Books',
    };
    return categories[value] || value;
  };

  const getConditionLabel = (value: string): string => {
    return value === 'new' ? 'New' : 'Used';
  };

  const firstImage = step2Data.images.find((img) => img !== '');

  const handlePublish = () => {
    Alert.alert(
      'Success! 🎉',
      'Your ad has been published successfully!',
      [
        {
          text: 'OK',
          onPress: onPublish,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Review all details before publishing.</Text>
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          {/* Product Image */}
          {firstImage && (
            <Image
              source={{ uri: firstImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          {/* Product Info */}
          <View style={styles.previewContent}>
            {/* Title and Price */}
            <Text style={styles.previewTitle} numberOfLines={2}>
              {step1Data.title}
            </Text>
            <Text style={styles.previewPrice}>
              PKR {step1Data.price}
              {step1Data.negotiable && (
                <Text style={styles.negotiableTag}> • Negotiable</Text>
              )}
            </Text>

            {/* Category and Condition */}
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getCategoryLabel(step1Data.category)}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  step1Data.condition === 'new' ? styles.badgeNew : styles.badgeUsed,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    step1Data.condition === 'new'
                      ? styles.badgeTextNew
                      : styles.badgeTextUsed,
                  ]}
                >
                  {getConditionLabel(step1Data.condition)}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{step1Data.description}</Text>
            </View>

            {/* Specifications */}
            {step2Data.specifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.specsContainer}>
                  {step2Data.specifications.map((spec, index) => (
                    <View key={index} style={styles.specTag}>
                      <Text style={styles.specText}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Images */}
            {step2Data.images.filter((img) => img !== '').length > 1 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Photos ({step2Data.images.filter((img) => img !== '').length})
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailContainer}
                >
                  {step2Data.images
                    .filter((img) => img !== '')
                    .map((img, index) => (
                      <Image
                        key={index}
                        source={{ uri: img }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <CustomButton title="Edit" onPress={onEdit} variant="outline" />
          </View>
          <View style={styles.buttonHalf}>
            <CustomButton title="Publish Ad" onPress={handlePublish} />
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
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E5E5',
  },
  previewContent: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  previewPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  negotiableTag: {
    fontSize: 14,
    color: '#00A86B',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeNew: {
    backgroundColor: '#E8F5E9',
  },
  badgeUsed: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  badgeTextNew: {
    color: '#2E7D32',
  },
  badgeTextUsed: {
    color: '#E65100',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
    fontFamily: 'Poppins',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specTag: {
    backgroundColor: '#00A86B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  thumbnailContainer: {
    gap: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
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

export default CreateAdStep3;
