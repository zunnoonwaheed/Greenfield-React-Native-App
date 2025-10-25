import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/hello
router.get('/', (_req: Request, res: Response) => {
  res.json({
    greeting: 'Hello from Greenfield /api/hello 👋',
    timestamp: new Date().toISOString()
  });
});

export default router;
