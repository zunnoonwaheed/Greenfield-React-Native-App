// screens/WelcomeScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

type Nav = StackNavigationProp<MainStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#A05BFF', '#FF6BA7', '#20BF55', '#FFC107'];

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const confetti = useRef([...Array(55)].map(() => new Animated.Value(0))).current;
  const navigatedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // confetti
  useEffect(() => {
    const loops = confetti.map((v, i) =>
      Animated.loop(
        Animated.timing(v, {
          toValue: 1,
          duration: 2600 + (i % 10) * 140,
          useNativeDriver: true,
        })
      )
    );
    Animated.stagger(85, loops).start();
  }, [confetti]);

  // auto navigate after ~2.3s
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      // change 'MainTabs' to your home route name if different
      navigation.replace('MainTabs');
    }, 2300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigation]);

  const onBack = () => {
    // stop pending auto-nav and go to Login
    if (timerRef.current) clearTimeout(timerRef.current);
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    navigation.replace('Login'); // or navigation.navigate('Login') if you prefer
  };

  const renderConfetti = () =>
    confetti.map((v, i) => {
      const x = Math.random() * width;
      const size = 4 + Math.random() * 6;
      const rotate = v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
      const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-60, height + 60] });
      return (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.confetti,
            {
              left: x,
              width: size,
              height: size * 2,
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              transform: [{ translateY }, { rotate }],
            },
          ]}
        />
      );
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <View style={styles.arrowBox}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.confettiWrap}>{renderConfetti()}</View>

      {/* Centered image (includes the “Welcome aboard!” text inside the asset) */}
      <View style={styles.centerContent}>
        <Image
          source={require('../images/homepage-assets/welcome.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safe: { backgroundColor: '#FFFFFF' },

  topBar: { height: 44, justifyContent: 'center', paddingHorizontal: 18 },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'flex-start' },
  arrowBox: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  arrowLine: { position: 'absolute', left: 6, width: 12, height: 2, backgroundColor: '#1A1A1A', borderRadius: 1 },
  arrowHead: {
    position: 'absolute',
    left: 2,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#1A1A1A',
  },

  confettiWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  confetti: { position: 'absolute', borderRadius: 2 },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  illustration: { width: width * 0.8, height: width * 0.8 * 1.05 },
});

export default WelcomeScreen;
