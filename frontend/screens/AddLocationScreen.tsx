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
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ORANGE = '#EA6A2A';         // header tone per mock
const MINT_TINT = '#FFD9BF';      // pattern tint on orange
const GREEN = '#0F7B5E';
const BG = '#FFFFFF';
const BORDER = '#E6E6E6';
const LABEL = '#1A1A1A';
const MUTED = '#6C6C6C';
const PLACEHOLDER = '#999999';
const SHEET_RADIUS = 30;
const { width } = Dimensions.get('window');

type PropertyType = 'house' | 'apartment';

const AddLocationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [city, setCity] = useState('Islamabad');
  const [area, setArea] = useState('');
  const [sector, setSector] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const [houseNumber, setHouseNumber] = useState('');

  const handleDone = () => {
    // save or send to backend here
    navigation.goBack();
  };

  const handleBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ORANGE} />

      {/* ORANGE HEADER WITH PATTERN */}
      <View style={styles.header}>
        <Image source={require('../images/homepage-assets/cart-home1.png')} style={[styles.cart, styles.cart1]} />
        <Image source={require('../images/homepage-assets/cart-home2.png')} style={[styles.cart, styles.cart2]} />
        <Image source={require('../images/homepage-assets/cart-home3.png')} style={[styles.cart, styles.cart3]} />

        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
              <View style={styles.arrowBox}>
                <View style={styles.arrowLine} />
                <View style={styles.arrowHead} />
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* SHEET */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 18 }}
          style={styles.sheet}
        >
          <View style={styles.grabber} />
          <Text style={styles.title}>Add Location</Text>
          <Text style={styles.subtitle}>We use your location to show local ads that matter.</Text>

          {/* City */}
          <Text style={styles.label}>City</Text>
          <View style={styles.field}>
            <Image source={require('../images/homepage-assets/map-location.png')} style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Islamabad"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>

          {/* Area */}
          <Text style={[styles.label, styles.mt12]}>Area</Text>
          <View style={styles.field}>
            <Image source={require('../images/homepage-assets/navigation.png')} style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="E.g. Dha"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>

          {/* Sector */}
          <Text style={[styles.label, styles.mt12]}>Sector</Text>
          <View style={styles.field}>
            <Image source={require('../images/homepage-assets/locate-fixed.png')} style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              value={sector}
              onChangeText={setSector}
              placeholder="e.g. Dha phase 2"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>

          {/* Street Number */}
          <Text style={[styles.label, styles.mt12]}>Street Number</Text>
          <View style={styles.field}>
            <Image source={require('../images/homepage-assets/map.png')} style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              value={streetNumber}
              onChangeText={setStreetNumber}
              placeholder="e.g. street number 5"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>

          {/* Property type */}
          <Text style={[styles.label, styles.mt12]}>House   <Text style={styles.muted}>  </Text>   Apartment</Text>
          <View style={styles.radioRow}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setPropertyType('house')} activeOpacity={0.8}>
              <View style={[styles.radio, propertyType === 'house' && styles.radioActive]} />
              <Text style={styles.radioText}>House</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setPropertyType('apartment')} activeOpacity={0.8}>
              <View style={[styles.radio, propertyType === 'apartment' && styles.radioActive]} />
              <Text style={styles.radioText}>Apartment</Text>
            </TouchableOpacity>
          </View>

          {/* House Number */}
          <Text style={[styles.label, styles.mt12]}>House Number</Text>
          <View style={styles.field}>
            <Image source={require('../images/homepage-assets/map-pin-house.png')} style={styles.leftIcon} />
            <TextInput
              style={styles.input}
              value={houseNumber}
              onChangeText={setHouseNumber}
              placeholder="e.g. House number 5"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleDone} activeOpacity={0.9}>
            <Text style={styles.primaryText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORANGE },

  header: { flex: 1, backgroundColor: ORANGE, position: 'relative' },
  safeTop: { flex: 1 },
  topBar: { height: 56, paddingHorizontal: 16, justifyContent: 'center' },

  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  arrowBox: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  arrowLine: { position: 'absolute', left: 6, width: 14, height: 2.4, backgroundColor: '#FFFFFF', borderRadius: 1.2 },
  arrowHead: {
    position: 'absolute', left: 3, width: 0, height: 0,
    borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 9,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#FFFFFF',
  },

  // pattern
  cart: { position: 'absolute', opacity: 0.22, tintColor: MINT_TINT },
  cart1: { width: 290, height: 290, top: 60, left: -96, transform: [{ rotate: '-18deg' }] },
  cart2: { width: 250, height: 250, top: 300, right: -80, transform: [{ rotate: '24deg' }] },
  cart3: { width: 200, height: 200, top: 170, right: -16, transform: [{ rotate: '-10deg' }] },

  // sheet
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingHorizontal: 20,
    paddingTop: 14,
    maxHeight: 640,
  },
  grabber: { alignSelf: 'center', width: 46, height: 4, borderRadius: 2, backgroundColor: '#E9E9E9', marginBottom: 12 },

  title: { fontSize: 18, fontWeight: '700', color: LABEL, marginBottom: 6 },
  subtitle: { fontSize: 14, color: MUTED, marginBottom: 14, lineHeight: 20 },

  label: { fontSize: 13, color: LABEL, fontWeight: '600', marginBottom: 8 },
  mt12: { marginTop: 12 },

  field: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', paddingRight: 12, marginBottom: 10,
  },
  leftIcon: { width: 18, height: 18, marginLeft: 14, marginRight: 10, resizeMode: 'contain', tintColor: '#6B6B6B' },
  input: { flex: 1, fontSize: 15, color: LABEL },

  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 22, marginBottom: 8 },
  radioOption: { flexDirection: 'row', alignItems: 'center' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: GREEN, marginRight: 8 },
  radioActive: { backgroundColor: GREEN, borderColor: GREEN },
  radioText: { fontSize: 15, color: LABEL },

  primaryBtn: {
    height: 52, borderRadius: 12, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center',
    marginTop: 12, marginBottom: 18,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default AddLocationScreen;
