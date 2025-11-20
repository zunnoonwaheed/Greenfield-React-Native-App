import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiTester, { TEST_USERS, TEST_DATA } from '../utils/apiTester';

export default function APITestScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTests = async (testType: 'all' | 'quick') => {
    setTesting(true);
    setResults(null);

    try {
      const result = testType === 'all'
        ? await apiTester.runAllTests()
        : await apiTester.runQuickTest();

      setResults(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to run tests');
    } finally {
      setTesting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 API Endpoint Tester</Text>
        <Text style={styles.subtitle}>
          Test all 56 PHP backend endpoints with seed data
        </Text>
      </View>

      {/* Test Data Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Test Data Available</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• 29 Test Products (10001-10029)</Text>
          <Text style={styles.infoText}>• 10 Test Users (password: Test@123)</Text>
          <Text style={styles.infoText}>• 5 Test Bundles</Text>
          <Text style={styles.infoText}>• 11 Test Orders</Text>
          <Text style={styles.infoText}>• Multiple Categories</Text>
        </View>
      </View>

      {/* Test User Credentials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Test User Credentials</Text>
        <View style={styles.credBox}>
          <Text style={styles.credTitle}>Ali Hassan:</Text>
          <Text style={styles.credText}>Email: {TEST_USERS.ali.email}</Text>
          <Text style={styles.credText}>Password: Test@123</Text>
        </View>
        <View style={styles.credBox}>
          <Text style={styles.credTitle}>Ayesha Khan:</Text>
          <Text style={styles.credText}>Email: {TEST_USERS.ayesha.email}</Text>
          <Text style={styles.credText}>Password: Test@123</Text>
        </View>
      </View>

      {/* Test Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛒 Test Products</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• Tomato: {TEST_DATA.products.tomato.slug}</Text>
          <Text style={styles.infoText}>• Apple: {TEST_DATA.products.apple.slug}</Text>
          <Text style={styles.infoText}>• Rice: {TEST_DATA.products.rice.slug}</Text>
          <Text style={styles.infoText}>• Milk: {TEST_DATA.products.milk.slug}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => runTests('all')}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🧪 Run All Tests (17 tests)</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => runTests('quick')}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>⚡ Run Quick Test (5 tests)</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {results && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Test Results</Text>
          <View style={styles.resultsBox}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Tests:</Text>
              <Text style={styles.resultValue}>{results.total}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, styles.passText]}>✅ Passed:</Text>
              <Text style={[styles.resultValue, styles.passText]}>{results.passed}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, styles.failText]}>❌ Failed:</Text>
              <Text style={[styles.resultValue, styles.failText]}>{results.failed}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Success Rate:</Text>
              <Text style={[
                styles.resultValue,
                results.passed === results.total ? styles.passText : styles.warnText
              ]}>
                {((results.passed / results.total) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Detailed Results */}
          <View style={styles.detailsBox}>
            <Text style={styles.detailsTitle}>Test Details:</Text>
            {results.tests.map((test: any, index: number) => (
              <View key={index} style={styles.testItem}>
                <Text style={test.status === 'PASS' ? styles.passIcon : styles.failIcon}>
                  {test.status === 'PASS' ? '✅' : '❌'}
                </Text>
                <View style={styles.testInfo}>
                  <Text style={styles.testName}>{test.name}</Text>
                  <Text style={styles.testMessage}>{test.message}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Instructions</Text>
        <View style={styles.infoBox}>
          <Text style={styles.instructionText}>
            1. Make sure your PHP backend is running on http://localhost:3000
          </Text>
          <Text style={styles.instructionText}>
            2. Import the seed file (complete_system_seed.sql)
          </Text>
          <Text style={styles.instructionText}>
            3. Click "Run All Tests" to test all endpoints
          </Text>
          <Text style={styles.instructionText}>
            4. Check console logs for detailed output
          </Text>
          <Text style={styles.instructionText}>
            5. All tests should pass if backend is configured correctly
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Backend: http://localhost:3000
        </Text>
        <Text style={styles.footerText}>
          Check Metro console for detailed logs
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  credBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  credTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  credText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  passText: {
    color: '#4CAF50',
  },
  failText: {
    color: '#f44336',
  },
  warnText: {
    color: '#FF9800',
  },
  detailsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  testItem: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  passIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  failIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  testMessage: {
    fontSize: 12,
    color: '#666',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    paddingLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
