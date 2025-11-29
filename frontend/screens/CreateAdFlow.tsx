/**
 * CreateAdFlow - Main screen managing 3-step ad creation flow
 * Handles step navigation and provides context
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Ionicons } from '@expo/vector-icons';
import { CreateAdProvider } from './CreateAdContext';
import CreateAdStep1 from './CreateAdStep1';
import CreateAdStep2 from './CreateAdStep2';
import CreateAdStep3 from './CreateAdStep3';

type CreateAdFlowNavigationProp = StackNavigationProp<MainStackParamList>;

const CreateAdFlowContent: React.FC = () => {
  const navigation = useNavigation<CreateAdFlowNavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDifferentInfo, setShowDifferentInfo] = useState(false);

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handlePublish = () => {
    // Navigate back to MainTabs which contains SellAdsTab
    // The SellAdsScreen will auto-refresh when it comes into focus
    navigation.navigate('MainTabs', { screen: 'SellAdsTab' });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Create Your Ad';
      case 2:
        return 'Product-Specific Info';
      case 3:
        return 'Contact & Location';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Arrow Row */}
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Image
            source={require('../images/homepage-assets/arrow-back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>

        {/* Subtitle */}
        <Text style={styles.headerSubtitle}>
          {currentStep === 1 && 'Sell What You Have, Earn What You Deserve!'}
          {currentStep === 2 && 'Be honest and clear — good descriptions attract more buyers.'}
          {currentStep === 3 && 'Contact & Location Information'}
        </Text>

        {/* Step Indicator and Add Different Info Button - Right Aligned */}
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>Step {currentStep} of 3</Text>
          {currentStep === 3 && (
            <TouchableOpacity
              style={styles.addDiffInfoButton}
              onPress={() => setShowDifferentInfo(!showDifferentInfo)}
              activeOpacity={0.7}
            >
              <Text style={styles.addDiffInfoText}>Add Different Info</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Step Content */}
      {currentStep === 1 && <CreateAdStep1 onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <CreateAdStep2 onNext={handleStep2Next} onBack={handleStep2Back} />
      )}
      {currentStep === 3 && (
        <CreateAdStep3
          onPublish={handlePublish}
          onBack={handleStep3Back}
          showDifferentInfo={showDifferentInfo}
        />
      )}
    </SafeAreaView>
  );
};

const CreateAdFlow: React.FC = () => {
  return (
    <CreateAdProvider>
      <CreateAdFlowContent />
    </CreateAdProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    fontFamily: 'DM Sans',
    lineHeight: 18,
    marginBottom: 6,
  },
  stepRow: {
    alignItems: 'flex-end',
    marginBottom: 4,
    gap: 8,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF6B35',
    fontFamily: 'DM Sans',
  },
  addDiffInfoButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  addDiffInfoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default CreateAdFlow;
