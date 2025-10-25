# 📱 Frontend Integration Guide

## Your Backend API URLs

**Base URL:** `https://greenfieldmobile.vercel.app`

### Available Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api` | GET | `{ "message": "Greenfield API is live 🚀", "version": "1.0.0", "timestamp": "..." }` |
| `/api/hello` | GET | `{ "greeting": "Hello from Greenfield /api/hello 👋", "timestamp": "..." }` |

---

## 🎯 React Native / Expo Examples

### Option 1: Using `fetch` (Built-in)

```typescript
// In your Expo app component or screen

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

// Example 1: Check if API is alive
const checkAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api`);
    const data = await response.json();
    console.log(data);
    // ✅ Returns: { message: "Greenfield API is live 🚀", version: "1.0.0", ... }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 2: Get hello message
const getHello = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hello`);
    const data = await response.json();
    console.log(data);
    // ✅ Returns: { greeting: "Hello from Greenfield /api/hello 👋", ... }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Option 2: Using Axios

First install axios:
```bash
npm install axios
```

Then in your Expo app:

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

// Example 1: Check API
const checkAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api`);
    console.log(response.data);
    // ✅ Returns: { message: "Greenfield API is live 🚀", ... }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 2: Get hello
const getHello = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/hello`);
    console.log(response.data);
    // ✅ Returns: { greeting: "Hello from Greenfield /api/hello 👋", ... }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🔥 Complete Component Example

### Using React Hooks with fetch

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

export default function ApiTestScreen() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [helloMessage, setHelloMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Test /api endpoint
  const testAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setApiMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  // Test /api/hello endpoint
  const testHello = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/hello`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setHelloMessage(data.greeting);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  // Test API on mount
  useEffect(() => {
    testAPI();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test Screen</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {apiMessage && (
        <View style={styles.section}>
          <Text style={styles.label}>GET /api:</Text>
          <Text style={styles.response}>{apiMessage}</Text>
        </View>
      )}

      {helloMessage && (
        <View style={styles.section}>
          <Text style={styles.label}>GET /api/hello:</Text>
          <Text style={styles.response}>{helloMessage}</Text>
        </View>
      )}

      <Button title="Test /api" onPress={testAPI} />
      <Button title="Test /api/hello" onPress={testHello} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  response: {
    color: '#333',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});
```

---

## 🧪 Quick Test Commands

### Test in browser:
- Open: https://greenfieldmobile.vercel.app/api
- Open: https://greenfieldmobile.vercel.app/api/hello

### Test with curl:
```bash
curl https://greenfieldmobile.vercel.app/api
curl https://greenfieldmobile.vercel.app/api/hello
```

### Expected Responses:

**GET /api:**
```json
{
  "message": "Greenfield API is live 🚀",
  "version": "1.0.0",
  "timestamp": "2025-01-26T..."
}
```

**GET /api/hello:**
```json
{
  "greeting": "Hello from Greenfield /api/hello 👋",
  "timestamp": "2025-01-26T..."
}
```

---

## 🔄 Error Handling Pattern

Always handle errors properly:

```typescript
const callAPI = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse JSON
    const data = await response.json();

    return data;
  } catch (error) {
    // Handle network errors, JSON parse errors, etc.
    console.error('API Error:', error);
    throw error;
  }
};

// Usage
try {
  const data = await callAPI('/api/hello');
  console.log(data);
} catch (error) {
  // Show error to user
}
```

---

## 📝 TypeScript Interfaces (Optional)

For better type safety in your Expo app:

```typescript
// API response types
interface APIHealthResponse {
  message: string;
  version: string;
  timestamp: string;
}

interface HelloResponse {
  greeting: string;
  timestamp: string;
}

// Usage with fetch
const getHello = async (): Promise<HelloResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/hello`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};
```

---

## 🚀 Your Mobile App is Ready!

Just use these URLs in your existing Expo app:

```typescript
const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

// Call any endpoint
fetch(`${API_BASE_URL}/api`)
fetch(`${API_BASE_URL}/api/hello`)
```

That's it! No changes needed to your Expo frontend structure. 🎉
