# 🚀 Greenfield API - Frontend Usage Guide

## 📍 Your API Base URL

```
https://greenfieldmobile.vercel.app
```

## 🔌 Available Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api` | GET | Health check | API status |
| `/api/hello` | GET | Simple greeting | Hello message |
| `/api/hello/:name` | GET | Personalized greeting | Hello with name |
| `/api/users` | GET | Get all users | User list |
| `/api/users/:id` | GET | Get user by ID | Single user |
| `/api/hello` | POST | Echo message | Received message |

---

## 📱 React Native / Expo Examples

### 1. Health Check (GET /api)

```typescript
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

export default function App() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api`);
      const data = await response.json();
      setApiStatus(data);
      console.log('API Response:', data);
      // Expected: { message: "Greenfield API is live 🚀", version: "1.0.0", ... }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <View>
      <Text>{apiStatus?.message}</Text>
    </View>
  );
}
```

### 2. Get Hello Message (GET /api/hello)

```typescript
const getHello = async () => {
  try {
    const response = await fetch('https://greenfieldmobile.vercel.app/api/hello');
    const data = await response.json();
    console.log(data);
    // Expected: { success: true, message: "Hello from Greenfield API!", timestamp: "..." }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Personalized Greeting (GET /api/hello/:name)

```typescript
const getPersonalizedHello = async (name: string) => {
  try {
    const response = await fetch(
      `https://greenfieldmobile.vercel.app/api/hello/${name}`
    );
    const data = await response.json();
    console.log(data);
    // Expected: { success: true, message: "Hello, John!", timestamp: "..." }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
getPersonalizedHello('John');
```

### 4. Get All Users (GET /api/users)

```typescript
const fetchUsers = async () => {
  try {
    const response = await fetch('https://greenfieldmobile.vercel.app/api/users');
    const data = await response.json();
    console.log(data);
    // Expected: { success: true, users: [{ id: 1, name: "...", email: "..." }, ...] }
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
```

### 5. Get Single User (GET /api/users/:id)

```typescript
const fetchUserById = async (userId: number) => {
  try {
    const response = await fetch(
      `https://greenfieldmobile.vercel.app/api/users/${userId}`
    );
    const data = await response.json();
    console.log(data);
    // Expected: { success: true, user: { id: 1, name: "...", email: "..." } }
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// Usage
fetchUserById(1);
```

### 6. POST Request (POST /api/hello)

```typescript
const sendMessage = async (message: string) => {
  try {
    const response = await fetch('https://greenfieldmobile.vercel.app/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    console.log(data);
    // Expected: { success: true, received: "Your message", timestamp: "..." }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Usage
sendMessage('Hello from React Native!');
```

---

## 🔧 Using Axios (Alternative)

If you prefer Axios over fetch:

```bash
npm install axios
```

### Example with Axios:

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

// GET request
const getHello = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/hello`);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const sendMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/hello`, {
      message
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎯 Complete Example: User List Component

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

const API_BASE_URL = 'https://greenfieldmobile.vercel.app';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
```

---

## 🧪 Testing Your API

### Using curl:

```bash
# Health check
curl https://greenfieldmobile.vercel.app/api

# Hello endpoint
curl https://greenfieldmobile.vercel.app/api/hello

# Personalized hello
curl https://greenfieldmobile.vercel.app/api/hello/World

# Get users
curl https://greenfieldmobile.vercel.app/api/users

# POST request
curl -X POST https://greenfieldmobile.vercel.app/api/hello \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from curl"}'
```

### Using browser:

Just open these URLs in your browser:
- https://greenfieldmobile.vercel.app/api
- https://greenfieldmobile.vercel.app/api/hello
- https://greenfieldmobile.vercel.app/api/users

---

## ⚡ Quick Reference

### Base URL
```typescript
const API_BASE_URL = 'https://greenfieldmobile.vercel.app';
```

### Making a GET Request
```typescript
const response = await fetch(`${API_BASE_URL}/api/endpoint`);
const data = await response.json();
```

### Making a POST Request
```typescript
const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
});
const data = await response.json();
```

### Error Handling
```typescript
try {
  const response = await fetch(`${API_BASE_URL}/api/endpoint`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  // Use data
} catch (error) {
  console.error('API Error:', error);
}
```

---

## 📝 Notes

1. **CORS is enabled** - Your frontend can call the API from any domain
2. **All responses are JSON** - Always use `.json()` to parse
3. **404 errors return helpful JSON** - Shows available endpoints
4. **Timestamps included** - All responses include ISO timestamp
5. **Error responses** - Always have `success: false` and descriptive `message`

---

## 🚀 After Deployment

Simply commit and push to GitHub:

```bash
git add .
git commit -m "Fix API routes for Vercel"
git push origin main
```

Vercel will automatically redeploy your backend!

Check deployment status at: https://vercel.com/dashboard
