/**
 * CreateAdFlow - Main screen managing 3-step ad creation flow
 * Handles step navigation and provides context
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { CreateAdProvider } from './CreateAdContext';
import CreateAdStep1 from './CreateAdStep1';
import CreateAdStep2 from './CreateAdStep2';
import CreateAdStep3 from './CreateAdStep3';

type CreateAdFlowNavigationProp = StackNavigationProp<RootStackParamList>;

const CreateAdFlowContent: React.FC = () => {
  const navigation = useNavigation<CreateAdFlowNavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);

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
    // Navigate back to SellAds screen after successful publish
    navigation.navigate('SellAds');
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
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step {currentStep} of 3</Text>
        </View>
      </View>

      {/* Step Content */}
      {currentStep === 1 && <CreateAdStep1 onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <CreateAdStep2 onNext={handleStep2Next} onBack={handleStep2Back} />
      )}
      {currentStep === 3 && (
        <CreateAdStep3 onPublish={handlePublish} onBack={handleStep3Back} />
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins',
  },
  stepIndicator: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7043',
    fontFamily: 'Poppins',
  },
});

export default CreateAdFlow;
