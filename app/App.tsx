import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

// API Configuration - Update this based on your environment
const getApiUrl = () => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api'; // iOS Simulator
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api'; // Android Emulator
  } else {
    return 'http://localhost:5000/api'; // Web
  }
};

const API_URL = getApiUrl();

interface ApiResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data?: any;
  version?: string;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Test API connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get<ApiResponse>(`${API_URL}`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Connection failed: ${err.message}\n\nMake sure the API server is running on port 5000`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const testHelloEndpoint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get<ApiResponse>(`${API_URL}/hello`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Request failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const testPersonalizedGreeting = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get<ApiResponse>(`${API_URL}/hello/Developer`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Request failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const testPostEndpoint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post<ApiResponse>(`${API_URL}/hello`, {
        message: 'Hello from React Native!'
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Request failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get<ApiResponse>(`${API_URL}/hello/db/test`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Database test failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🌿 Greenfield</Text>
          <Text style={styles.subtitle}>Expo + Express API Demo</Text>
          <Text style={styles.apiUrl}>API: {API_URL}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={testConnection}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test API Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={testHelloEndpoint}
            disabled={loading}
          >
            <Text style={styles.buttonText}>GET /api/hello</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={testPersonalizedGreeting}
            disabled={loading}
          >
            <Text style={styles.buttonText}>GET /api/hello/:name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={testPostEndpoint}
            disabled={loading}
          >
            <Text style={styles.buttonText}>POST /api/hello</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dbButton]}
            onPress={testDatabaseConnection}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test Database</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>❌ Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {response && !loading ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>✅ Response</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  apiUrl: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dbButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  responseContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  responseText: {
    color: '#1B5E20',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
