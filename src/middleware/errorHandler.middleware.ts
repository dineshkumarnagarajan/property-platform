import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error:', err);

    if (config.env === 'production') {
        return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(err.status || 500).json({
        error: err.message,
        ...(config.env === 'development' && { stack: err.stack }),
    });
};