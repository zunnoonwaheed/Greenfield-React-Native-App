import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import {
  checkServerHealth,
  getNetworkDiagnostics,
  API_BASE_URL,
} from '../api/axiosConfig';

type NetworkDiagnosticScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'NetworkDiagnostic'
>;

interface DiagnosticData {
  platform: string;
  apiBaseUrl: string;
  localIP: string;
  isDevelopment: boolean;
  serverOnline?: boolean;
  healthCheckResponse?: any;
  healthCheckError?: string;
}

const NetworkDiagnosticScreen = () => {
  const navigation = useNavigation<NetworkDiagnosticScreenNavigationProp>();
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const data = await getNetworkDiagnostics();
      setDiagnostics(data);
      setLastTestTime(new Date());
    } catch (error: any) {
      Alert.alert(
        'Diagnostic Error',
        error.message || 'Failed to run diagnostics'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkServerHealth();

      if (result.success) {
        Alert.alert(
          '✅ Connection Successful',
          `Server is reachable at:\n${API_BASE_URL}\n\nResponse: ${JSON.stringify(result.data, null, 2)}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '❌ Connection Failed',
          `Cannot reach server at:\n${API_BASE_URL}\n\nError: ${result.error}\n\nTroubleshooting:\n• Ensure backend server is running\n• Check your IP address is correct\n• Verify your device is on the same WiFi network\n• Check firewall settings`,
          [{ text: 'OK' }]
        );
      }

      // Refresh diagnostics after test
      await runDiagnostics();
    } catch (error: any) {
      Alert.alert('Test Failed', error.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (isOnline: boolean | undefined) => {
    if (isOnline === undefined) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: Colors.textLight }]}>
          <Text style={styles.statusText}>Unknown</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: isOnline ? Colors.success : Colors.error },
        ]}
      >
        <Text style={styles.statusText}>
          {isOnline ? '✓ Online' : '✗ Offline'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={Layout.iconSize} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network Diagnostics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Server Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="server-outline" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Server Status</Text>
          </View>
          {diagnostics && renderStatusBadge(diagnostics.serverOnline)}
          {lastTestTime && (
            <Text style={styles.lastTestText}>
              Last checked: {lastTestTime.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Configuration Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings-outline" size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Configuration</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform:</Text>
            <Text style={styles.infoValue}>{diagnostics?.platform || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Environment:</Text>
            <Text style={styles.infoValue}>
              {diagnostics?.isDevelopment ? 'Development' : 'Production'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>API Base URL:</Text>
            <Text style={[styles.infoValue, styles.urlText]} numberOfLines={2}>
              {diagnostics?.apiBaseUrl || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Local IP:</Text>
            <Text style={styles.infoValue}>{diagnostics?.localIP || 'N/A'}</Text>
          </View>
        </View>

        {/* Health Check Response */}
        {diagnostics?.healthCheckResponse && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
              <Text style={styles.cardTitle}>Health Check Response</Text>
            </View>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {JSON.stringify(diagnostics.healthCheckResponse, null, 2)}
              </Text>
            </View>
          </View>
        )}

        {/* Error Information */}
        {diagnostics?.healthCheckError && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="alert-circle-outline" size={24} color={Colors.error} />
              <Text style={styles.cardTitle}>Connection Error</Text>
            </View>
            <Text style={styles.errorText}>{diagnostics.healthCheckError}</Text>
          </View>
        )}

        {/* Troubleshooting Tips */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.info} />
            <Text style={styles.cardTitle}>Troubleshooting</Text>
          </View>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>
              • Ensure your backend server is running on port 3000
            </Text>
            <Text style={styles.tipText}>
              • Verify your device is connected to the same WiFi network
            </Text>
            <Text style={styles.tipText}>
              • Check that the IP address in axiosConfig.js is correct
            </Text>
            <Text style={styles.tipText}>
              • Disable any VPN or firewall that might block connections
            </Text>
            <Text style={styles.tipText}>
              • For iOS Simulator: Use localhost or your local IP
            </Text>
            <Text style={styles.tipText}>
              • For Android Emulator: Use 10.0.2.2 or your local IP
            </Text>
            <Text style={styles.tipText}>
              • For Physical Device: Must use your local IP address
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={testConnection}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <>
              <Ionicons name="flash-outline" size={20} color={Colors.textWhite} />
              <Text style={styles.testButtonText}>Test Connection</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={runDiagnostics}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
              <Text style={styles.refreshButtonText}>Refresh Diagnostics</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: Spacing.xxl,
    height: Spacing.xxl,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.h5,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  headerSpacer: {
    width: Spacing.xxl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.medium,
    padding: Spacing.large,
    marginBottom: Spacing.medium,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  cardTitle: {
    fontSize: Typography.h6,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginLeft: Spacing.gap,
  },
  statusBadge: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
    marginBottom: Spacing.gap,
  },
  statusText: {
    color: Colors.textWhite,
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semibold,
  },
  lastTestText: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.gap,
  },
  infoLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: Colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  urlText: {
    fontFamily: 'monospace',
    fontSize: Typography.bodySmall,
  },
  codeBlock: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.small,
    padding: Spacing.medium,
    marginTop: Spacing.gap,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: Typography.bodySmall,
    color: Colors.text,
  },
  errorText: {
    fontSize: Typography.body,
    color: Colors.error,
    marginTop: Spacing.gap,
  },
  tipContainer: {
    marginTop: Spacing.gap,
  },
  tipText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
    lineHeight: Spacing.large,
  },
  testButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.medium,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.medium,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  testButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.h6,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.gap,
  },
  refreshButton: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.medium,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  refreshButtonText: {
    color: Colors.primary,
    fontSize: Typography.h6,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.gap,
  },
});

export default NetworkDiagnosticScreen;
