import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import { addLocation } from '../api/locationAPI';

type AddLocationScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AddLocationScreen = () => {
  const navigation = useNavigation<AddLocationScreenNavigationProp>();
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [propertyType, setPropertyType] = useState<'house' | 'apartment'>('house');
  const [houseNumber, setHouseNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDone = async () => {
    // Validation
    if (!city.trim()) {
      Alert.alert('Validation Error', 'Please enter a city');
      return;
    }

    if (!area.trim()) {
      Alert.alert('Validation Error', 'Please enter an area');
      return;
    }

    if (!sector.trim()) {
      Alert.alert('Validation Error', 'Please enter a sector');
      return;
    }

    if (!streetNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter a street number');
      return;
    }

    if (!houseNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter a house/apartment number');
      return;
    }

    setLoading(true);

    try {
      const locationData = {
        city: city.trim(),
        area: area.trim(),
        sector: sector.trim(),
        streetNumber: streetNumber.trim(),
        propertyType,
        houseNumber: houseNumber.trim(),
      };

      const response = await addLocation(locationData);

      if (response.success) {
        // Navigate to Welcome screen
        navigation.navigate('Welcome');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Unable to add location. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E84118" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.title}>Add Location</Text>
            <Text style={styles.subtitle}>
              We use your location to show local ads that matter.
            </Text>

            {/* City Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="map-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Islamabad"
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Area Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Area</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="navigate-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="E.g. Dha"
                  value={area}
                  onChangeText={setArea}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Sector Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sector</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="location-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Dha phase 2"
                  value={sector}
                  onChangeText={setSector}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Street Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Street Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="pin-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. street number 5"
                  value={streetNumber}
                  onChangeText={setStreetNumber}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Property Type Selection */}
            <View style={styles.propertyTypeContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPropertyType('house')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {propertyType === 'house' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>House</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPropertyType('apartment')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {propertyType === 'apartment' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Apartment</Text>
              </TouchableOpacity>
            </View>

            {/* House Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>House Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="home-outline" 
                  size={20} 
                  color="#666" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. House number 5"
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={[styles.doneButton, loading && styles.doneButtonDisabled]}
              onPress={handleDone}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.doneButtonText}>Done</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E84118',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0D7F6F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0D7F6F',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  doneButton: {
    backgroundColor: '#0D7F6F',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#0D7F6F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonDisabled: {
    opacity: 0.6,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddLocationScreen;