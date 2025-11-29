/**
 * ChatbotModal - Popup Chat Component
 * Appears as overlay on homepage when chatbot button is pressed
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ visible, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi, I\'m looking for "Soya Chunks." Are they in stock?',
      isUser: true,
      time: '12:28 PM',
    },
    {
      id: '2',
      text: 'Hi! Thanks for reaching out. We don\'t have "Soya Chunks" in our inventory.',
      isUser: false,
      time: '12:27 PM',
    },
    {
      id: '3',
      text: 'Oh okay, is there a way to get notified when they\'re available?',
      isUser: true,
      time: '12:28 PM',
    },
    {
      id: '4',
      text: 'Absolutely! Would you like me to forward your request to our team so they can try to add it to our catalog?',
      isUser: false,
      time: '12:27 PM',
    },
    {
      id: '5',
      text: 'Yes, please. That would be great.',
      isUser: true,
      time: '12:28 PM',
    },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      time: getCurrentTime(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! Our team will get back to you shortly.',
        isUser: false,
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, botResponse]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.botMessageText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text
        style={[
          styles.messageTime,
          message.isUser ? styles.userMessageTime : styles.botMessageTime,
        ]}
      >
        {message.time}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.chatContainer}>
            <ImageBackground
              source={require('../images/homepage-assets/background-chatbot.png')}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Image
                    source={require('../images/homepage-assets/chatbot-profile.png')}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>Chat with Ali Imran</Text>
                    <View style={styles.onlineStatus}>
                      <Text style={styles.onlineText}>Online</Text>
                      <View style={styles.onlineDot} />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeIcon}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Messages */}
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                  scrollViewRef.current?.scrollToEnd({ animated: false })
                }
              >
                {messages.map(renderMessage)}
              </ScrollView>

              {/* Input Area */}
              <View style={styles.inputContainer}>
                <Image
                  source={require('../images/homepage-assets/Base.png')}
                  style={styles.inputAvatar}
                  resizeMode="cover"
                />
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Write a message..."
                    placeholderTextColor="#9CA3AF"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../images/homepage-assets/send.png')}
                      style={styles.sendIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 60,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 400,
    flex: 1,
    justifyContent: 'center',
  },
  chatContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
    minHeight: 500,
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    gap: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'DM Sans',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'DM Sans',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: '#64748B',
    fontWeight: '300',
    marginTop: -4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  messageContainer: {
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#059669',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DM Sans',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'DM Sans',
  },
  userMessageTime: {
    textAlign: 'right',
  },
  botMessageTime: {
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 16,
    paddingRight: 6,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'DM Sans',
    paddingVertical: 0,
  },
  sendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 28,
    height: 28,
  },
});

export default ChatbotModal;
