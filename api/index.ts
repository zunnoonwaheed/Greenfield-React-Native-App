import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helloRouter from './hello';

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
// IMPORTANT: Vercel routes to /api automatically
// So '/' here becomes '/api' externally
// And '/hello' here becomes '/api/hello' externally
// ==========================================

// Root endpoint: GET /api
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Greenfield API is live 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount hello router at /hello (becomes /api/hello externally)
app.use('/hello', helloRouter);

// 404 handler - must be AFTER all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api',
      'GET /api/hello'
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
    console.log(`📍 API: http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
export default app;
