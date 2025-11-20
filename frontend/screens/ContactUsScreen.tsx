/**
 * ContactUsScreen - Contact Support Form
 * Email, subject, message, priority, attachment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import * as DocumentPicker from 'expo-document-picker';

type ContactUsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface SubjectOption {
  id: string;
  label: string;
}

interface PriorityOption {
  id: string;
  label: string;
  color: string;
}

const ContactUsScreen: React.FC = () => {
  const navigation = useNavigation<ContactUsScreenNavigationProp>();

  const [email, setEmail] = useState('Johndoe87@gmail.com');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [attachment, setAttachment] = useState<{ name: string; uri: string } | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);

  const subjectOptions: SubjectOption[] = [
    { id: 'order', label: 'Order Issue' },
    { id: 'payment', label: 'Payment Problem' },
    { id: 'delivery', label: 'Delivery Concern' },
    { id: 'product', label: 'Product Quality' },
    { id: 'account', label: 'Account Settings' },
    { id: 'technical', label: 'Technical Support' },
    { id: 'feedback', label: 'General Feedback' },
    { id: 'other', label: 'Other' },
  ];

  const priorityOptions: PriorityOption[] = [
    { id: 'low', label: 'Low', color: '#4CAF50' },
    { id: 'medium', label: 'Medium', color: '#FF9800' },
    { id: 'high', label: 'High', color: '#E53935' },
  ];

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachment({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const isFormValid = () => {
    return (
      email.trim() !== '' &&
      email.includes('@') &&
      selectedSubject !== '' &&
      message.trim().length >= 10
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in all required fields. Message must be at least 10 characters.'
      );
      return;
    }

    // TODO: API call to submit contact form
    Alert.alert(
      'Message Sent!',
      'Thank you for contacting us. Our support team will get back to you within 24-48 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedSubject('');
            setMessage('');
            setSelectedPriority('medium');
            setAttachment(null);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getSubjectLabel = () => {
    const subject = subjectOptions.find((s) => s.id === selectedSubject);
    return subject ? subject.label : '';
  };

  const getPriorityLabel = () => {
    const priority = priorityOptions.find((p) => p.id === selectedPriority);
    return priority ? priority.label : '';
  };

  const getPriorityColor = () => {
    const priority = priorityOptions.find((p) => p.id === selectedPriority);
    return priority ? priority.color : '#FF9800';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../images/homepage-assets/arrow-back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Contact Email (Read-Only) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Email</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../images/homepage-assets/messege-box.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <Text style={styles.emailText}>{email} (default)</Text>
          </View>
        </View>

        {/* Subject */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subject</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowSubjectModal(true)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/homepage-assets/tag.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.dropdownText,
                !selectedSubject && styles.dropdownPlaceholder,
              ]}
            >
              {selectedSubject ? getSubjectLabel() : 'Select subject'}
            </Text>
            <Image
              source={require('../images/homepage-assets/dropdown-pic.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Message */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <View style={styles.messageContainer}>
            <Image
              source={require('../images/homepage-assets/bring-to-front.png')}
              style={styles.messageIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textArea}
              placeholder="Write your message here"
              placeholderTextColor="#999999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Priority */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowPriorityModal(true)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/homepage-assets/bill.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.dropdownText,
                !selectedPriority && styles.dropdownPlaceholder,
              ]}
            >
              {selectedPriority ? getPriorityLabel() : 'Select Priority'}
            </Text>
            <Image
              source={require('../images/homepage-assets/dropdown-pic.png')}
              style={styles.dropdownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Attachment */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Add Attachment (Optional)</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => Alert.alert('Info', 'You can attach images, PDFs, or other files to help us better understand your issue.')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Image
                source={require('../images/circle-question-mark.png')}
                style={styles.infoIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handlePickDocument}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/homepage-assets/location-profile.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <Text style={styles.attachmentText}>
              {attachment ? attachment.name : 'Image.png'}
            </Text>
            <Image
              source={require('../images/homepage-assets/upload-icon.png')}
              style={styles.uploadIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Subject Modal */}
      <Modal
        visible={showSubjectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSubjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity
                onPress={() => setShowSubjectModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {subjectOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    selectedSubject === option.id && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubject(option.id);
                    setShowSubjectModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                  {selectedSubject === option.id && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Priority Modal */}
      <Modal
        visible={showPriorityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Priority</Text>
              <TouchableOpacity
                onPress={() => setShowPriorityModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <View style={styles.optionsList}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    selectedPriority === option.id && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedPriority(option.id);
                    setShowPriorityModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.priorityOption}>
                    <View
                      style={[styles.priorityDot, { backgroundColor: option.color }]}
                    />
                    <Text style={styles.optionText}>{option.label}</Text>
                  </View>
                  {selectedPriority === option.id && (
                    <Ionicons name="checkmark" size={20} color="#00A86B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoButton: {
    padding: 0,
    marginLeft: 4,
  },
  infoIcon: {
    width: 14,
    height: 14,
    tintColor: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
  },
  uploadIcon: {
    width: 20,
    height: 20,
  },
  inputIconLeft: {
    marginRight: 12,
  },
  emailText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  dropdownPlaceholder: {
    color: '#999999',
  },
  messageContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    alignItems: 'flex-start',
  },
  messageIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    minHeight: 80,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  attachmentText: {
    flex: 1,
    fontSize: 15,
    color: '#999999',
  },
  submitButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  optionsList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 15,
    color: '#000000',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default ContactUsScreen;
