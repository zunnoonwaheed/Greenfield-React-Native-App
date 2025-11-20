/**
 * MessagesScreen - AI Chatbot Interface
 * Simulates intelligent bot responses with 1-second delay
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type MessagesScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Messages'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to Greenfield Support. How can I assist you today?',
      sender: 'bot',
      timestamp: getCurrentTime(),
    },
  ]);

  // Bot response templates
  const botResponses: { [key: string]: string } = {
    order: "I'd be happy to help with your order! Could you please provide your order number?",
    delivery: "Let me check the delivery status for you. What's your order number?",
    track: "I can help you track your order. Please share your order number.",
    payment: "I understand you have a question about payment. How can I assist you?",
    refund: "I'll help you with the refund process. Can you tell me more about the issue?",
    cancel: "I can assist with order cancellation. Please provide your order number.",
    help: "I'm here to help! You can ask me about:\n• Order status\n• Delivery tracking\n• Payments & refunds\n• Product information\n• Account settings",
    thank: "You're welcome! Is there anything else I can help you with? 😊",
    default: "I understand. Could you please provide more details so I can assist you better?",
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
      return botResponses.order;
    } else if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping')) {
      return botResponses.delivery;
    } else if (lowerMessage.includes('track')) {
      return botResponses.track;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return botResponses.payment;
    } else if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
      return botResponses.refund;
    } else if (lowerMessage.includes('cancel')) {
      return botResponses.cancel;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return botResponses.help;
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return botResponses.thank;
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return "Hello! How can I help you today? 😊";
    } else if (lowerMessage.match(/\d{5}/)) {
      // If message contains order number (5 digits)
      return "Thank you! I found your order. It's currently being processed and will be delivered within 2-3 business days. Would you like to know anything else?";
    } else {
      return botResponses.default;
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText.trim(),
        sender: 'user',
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessageText('');
      setIsTyping(true);

      // Simulate bot thinking and response after 1 second
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(userMessage.text),
          sender: 'bot',
          timestamp: getCurrentTime(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.sender === 'bot';

    return (
      <View style={[styles.messageContainer, isBot ? styles.botMessageContainer : styles.userMessageContainer]}>
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botMessageText : styles.userMessageText]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timestamp, isBot ? styles.botTimestamp : styles.userTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.botMessageContainer]}>
        <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>AI Support Bot</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={renderTypingIndicator}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.7}>
              <Ionicons name="happy-outline" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Write a message…"
              placeholderTextColor={Colors.textLight}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={handleSendMessage}
              activeOpacity={0.7}
              disabled={!messageText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={messageText.trim() ? Colors.textWhite : Colors.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerSpacer: {
    width: 32,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h5,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.caption,
    color: Colors.primary,
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.screenPadding,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: Spacing.medium,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  botBubble: {
    backgroundColor: Colors.background,
    borderBottomLeftRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  typingBubble: {
    paddingVertical: Spacing.medium,
  },
  messageText: {
    fontSize: Typography.bodySmall,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.textWhite,
  },
  botMessageText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: Typography.tiny,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  botTimestamp: {
    textAlign: 'left',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.textLight,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.8,
  },
  inputContainer: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
  },
  attachmentButton: {
    marginRight: Spacing.small,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.text,
    maxHeight: 80,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    marginLeft: Spacing.small,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});

export default MessagesScreen;