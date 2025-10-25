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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import * as DocumentPicker from 'expo-document-picker';

type ContactUsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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

  const [email, setEmail] = useState('ahmed.khan@example.com');
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
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="headset-outline" size={48} color="#00A86B" />
          <Text style={styles.infoTitle}>We're Here to Help</Text>
          <Text style={styles.infoText}>
            Our support team is available 24/7 to assist you with any questions or concerns.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Subject <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSubjectModal(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedSubject && styles.dropdownPlaceholder,
                ]}
              >
                {selectedSubject ? getSubjectLabel() : 'Select a subject'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowPriorityModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.priorityContainer}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor() },
                  ]}
                />
                <Text style={styles.dropdownText}>{getPriorityLabel()}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Message <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your issue or question in detail..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{message.length} characters</Text>
          </View>

          {/* Attachment */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachment (Optional)</Text>
            {attachment ? (
              <View style={styles.attachmentCard}>
                <View style={styles.attachmentInfo}>
                  <Ionicons name="document-attach" size={24} color="#00A86B" />
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {attachment.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleRemoveAttachment}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={24} color="#E53935" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickDocument}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={24} color="#00A86B" />
                <Text style={styles.uploadText}>Upload File</Text>
                <Text style={styles.uploadHint}>PDF, Image, or Document</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid()}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  infoText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  required: {
    color: '#E53935',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000000',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  uploadButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    paddingVertical: 24,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A86B',
    marginTop: 8,
    fontFamily: 'Poppins',
  },
  uploadHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  attachmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  attachmentName: {
    fontSize: 13,
    color: '#000000',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#00A86B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Poppins',
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
    borderBottomColor: '#F5F5F5',
  },
  optionItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default ContactUsScreen;
