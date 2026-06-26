import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const requireSecret = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const expected = `Bearer ${env.ACTIVITY_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
