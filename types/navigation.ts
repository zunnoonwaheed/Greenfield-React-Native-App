// ============================================
// NAVIGATION TYPES
// Centralized navigation type definitions
// ============================================

import type { AuthStackParamList } from '../navigation/AuthStack';
import type { MainStackParamList } from '../navigation/MainStack';

/**
 * Root Navigation types
 * Use these for type-safe navigation throughout the app
 */

// Combined type for all routes in the app
export type RootStackParamList = AuthStackParamList & MainStackParamList;

// Re-export for convenience
export type { AuthStackParamList, MainStackParamList };

/**
 * Usage example:
 *
 * import { useNavigation } from '@react-navigation/native';
 * import type { StackNavigationProp } from '@react-navigation/stack';
 * import type { AuthStackParamList } from '../types/navigation';
 *
 * type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
 *
 * const LoginScreen = () => {
 *   const navigation = useNavigation<LoginScreenNavigationProp>();
 *   // ...
 * };
 */
