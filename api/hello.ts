import { Router, Request, Response } from 'express';
import { query } from './db';

const router = Router();

// GET /api/hello - Simple hello world
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello from Greenfield API!',
    timestamp: new Date().toISOString()
  });
});

// GET /api/hello/:name - Personalized greeting
router.get('/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  res.json({
    success: true,
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

// POST /api/hello - Echo back posted data
router.post('/', (req: Request, res: Response) => {
  const { message } = req.body;
  res.json({
    success: true,
    message: 'Message received',
    echo: message || 'No message provided',
    timestamp: new Date().toISOString()
  });
});

// GET /api/hello/db/test - Test database connection
router.get('/db/test', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
