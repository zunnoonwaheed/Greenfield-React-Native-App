import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// ROUTES
// Note: Vercel mounts this at /api, so:
// - '/' here = '/api' externally
// - '/hello' here = '/api/hello' externally
// ==========================================

// Root endpoint: GET /api
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Greenfield API is live 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api',
      hello: '/api/hello',
      users: '/api/users'
    }
  });
});

// Hello endpoint: GET /api/hello
app.get('/hello', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello from Greenfield API!',
    timestamp: new Date().toISOString()
  });
});

// Hello with name: GET /api/hello/:name
app.get('/hello/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  res.json({
    success: true,
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

// Users endpoint: GET /api/users
app.get('/users', (_req: Request, res: Response) => {
  res.json({
    success: true,
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

// Users by ID: GET /api/users/:id
app.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    user: {
      id: parseInt(id),
      name: 'Sample User',
      email: 'user@example.com'
    }
  });
});

// POST example: POST /api/hello
app.post('/hello', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({
    success: true,
    received: message || 'No message provided',
    timestamp: new Date().toISOString()
  });
});

// 404 handler - must be AFTER all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api',
      'GET /api/hello',
      'GET /api/hello/:name',
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/hello'
    ]
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
export default app;
