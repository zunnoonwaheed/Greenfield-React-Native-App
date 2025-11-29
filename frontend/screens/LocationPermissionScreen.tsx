// screens/LocationPermissionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type LocationPermissionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LocationPermission'
>;

interface LocationPermissionScreenProps {
  onBack?: () => void;
}

const GREEN = '#0F7B5E';
const PATTERN_TINT = '#D4F1E8';

const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({ onBack }) => {
  const navigation = useNavigation<LocationPermissionScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleYesAllow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        await AsyncStorage.setItem(
          'userLocation',
          JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
          })
        );
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to personalize your experience. You can still continue with limited features.',
          [
            { text: 'Continue Anyway', onPress: () => navigation.navigate('Login') },
            { text: 'Try Again', onPress: handleYesAllow },
          ]
        );
      }
    } catch (e) {
      Alert.alert(
        'Error',
        'Unable to get location. You can continue without location access.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEssentialOnly = () => navigation.navigate('Login');
  const handleBack = () => {
    if (onBack) return onBack();
    // @ts-ignore
    if (navigation.canGoBack?.()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {/* Header with background image */}
      <ImageBackground
        source={require('../images/homepage-assets/auth-signup-screen.png')}
        style={styles.header}
        resizeMode="cover"
      >
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
              <View style={styles.arrowContainer}>
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Privacy</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Bottom sheet */}
      <View style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <Text style={styles.title}>Allow Location</Text>
          <Text style={styles.description}>
            To personalise what you see from us, we collect info about your location. This helps us
            (and trusted partners) show you nearby offers, bundles, and services tailored to you.
            {'\n'}
            Read our Location Policy.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryDisabled]}
              onPress={handleYesAllow}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryText}>Yes, Allow</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEssentialOnly}
              disabled={loading}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryText}>Only Allow Essential Access</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const SHEET_RADIUS = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GREEN },

  header: {
    flex: 1,
    backgroundColor: GREEN,
    position: 'relative',
  },

  safeTop: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  arrowContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  arrowLine: { position: 'absolute', left: 6, width: 14, height: 2.4, backgroundColor: '#FFFFFF', borderRadius: 1.2 },
  arrowHead: {
    position: 'absolute',
    left: 3,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  topTitle: {
    color: '#EAF7F2',
    fontSize: 17,
    fontWeight: Platform.select({ ios: '600', android: '700' }) as any,
    letterSpacing: -0.2,
  },

  // Sheet
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    width,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 26 + (Platform.OS === 'ios' ? 8 : 0),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 10,
  },
  grabber: { alignSelf: 'center', width: 46, height: 4, borderRadius: 2, backgroundColor: '#E9E9E9', marginBottom: 14 },

  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 20, color: '#4E4E4E', marginBottom: 18 },

  buttons: { gap: 12 },
  primaryButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  primaryDisabled: { opacity: 0.6 },

  secondaryButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#2C2C2C', fontSize: 16, fontWeight: '600' },
});

export default LocationPermissionScreen;
