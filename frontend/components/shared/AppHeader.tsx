// ============================================
// APP HEADER COMPONENT
// Reusable header with Back and Home buttons
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  onBackPress?: () => void;
  onHomePress?: () => void;
  backgroundColor?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = true,
  showHome = true,
  onBackPress,
  onHomePress,
  backgroundColor = Colors.background,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleHomePress = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      navigation.navigate('MainTabs' as never);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../images/homepage-assets/arrow-back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <View style={styles.spacer} />
        {showHome && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleHomePress}
            activeOpacity={0.7}
          >
            <Ionicons name="home" size={Layout.iconSize} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconButton: {
    width: Spacing.xxl,
    height: Spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.h5,
    fontWeight: Typography.bold,
    color: Colors.text,
    paddingHorizontal: 4,
  },
});

export default AppHeader;
