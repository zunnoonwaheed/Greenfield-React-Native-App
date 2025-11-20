import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

type ReviewNavigationProp = StackNavigationProp<MainStackParamList, 'Review'>;

const FEEDBACK_OPTIONS = [
  'Smooth and fast ordering',
  'Quick delivery',
  'Fresh and high-quality products',
  'Great prices and deals',
  'Helpful support team',
];

const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<ReviewNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>(['Smooth and fast ordering']);
  const [review, setReview] = useState('');

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleFeedback = (option: string) => {
    if (selectedFeedback.includes(option)) {
      setSelectedFeedback(selectedFeedback.filter(item => item !== option));
    } else {
      setSelectedFeedback([...selectedFeedback, option]);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit review to backend
    console.log('Feedback:', selectedFeedback, 'Review:', review);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Image
          source={require('../images/homepage-assets/arrow-back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Emoji Rating */}
          <View style={styles.emojiContainer}>
            <Image
              source={require('../images/homepage-assets/emojis.png')}
              style={styles.emojisImage}
              resizeMode="contain"
            />
          </View>

          {/* Feedback Options */}
          <View style={styles.feedbackContainer}>
            {FEEDBACK_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.feedbackOption}
                onPress={() => toggleFeedback(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.feedbackText}>{option}</Text>
                <View style={[
                  styles.checkbox,
                  selectedFeedback.includes(option) && styles.checkboxSelected
                ]}>
                  {selectedFeedback.includes(option) && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Write Review Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Write your review</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tell us how was your order?"
              placeholderTextColor="#C7C7C7"
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Give Review</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  emojiContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  emojisImage: {
    width: '100%',
    height: 100,
  },
  feedbackContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feedbackOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    borderColor: '#026A49',
    backgroundColor: '#FFFFFF',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#026A49',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#000000',
    minHeight: 110,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#026A49',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ReviewScreen;
