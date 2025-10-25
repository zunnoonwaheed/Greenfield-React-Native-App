// ============================================
// MAIN SERVER FILE
// Express server configuration and startup
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const os = require('os');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adRoutes = require('./routes/adRoutes');

// Import database pool
const { pool } = require('./config/database');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Determine allowed CORS origins
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['*']; // Default: allow all (for development)

const corsOptions = {
  origin: corsOrigins,
  credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ads', adRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Greenfield API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      user: '/api/user/*',
      location: '/api/location/*',
      products: '/api/products/*',
      categories: '/api/categories/*',
      orders: '/api/orders/*',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

// Helper: Get local IP address (for mobile testing)
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
};

const startServer = async () => {
  try {
    const [result] = await pool.query('SELECT NOW() AS now');
    console.log('✅ Database connected successfully');
    console.log('Database time:', result[0].now);

    app.listen(PORT, () => {
      const localIP = getLocalIP();
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Local URL: http://localhost:${PORT}/api`);
      console.log(`🚀 Network URL (for mobile): http://${localIP}:${PORT}/api`);
      console.log('🚀 ========================================');
      console.log('');
      console.log('📍 Available endpoints:');
      console.log('   POST   /api/auth/signup');
      console.log('   POST   /api/auth/login');
      console.log('   POST   /api/auth/forgot-password');
      console.log('   POST   /api/auth/reset-password');
      console.log('   POST   /api/auth/logout');
      console.log('   GET    /api/user/profile');
      console.log('   PUT    /api/user/profile');
      console.log('   POST   /api/user/change-password');
      console.log('   DELETE /api/user/account');
      console.log('   POST   /api/location/add');
      console.log('   GET    /api/location/list');
      console.log('   GET    /api/location/default');
      console.log('   PUT    /api/location/set-default/:id');
      console.log('   PUT    /api/location/update/:id');
      console.log('   DELETE /api/location/delete/:id');
      console.log('');
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  try {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database pool:', err.message);
    process.exit(1);
  }
});
