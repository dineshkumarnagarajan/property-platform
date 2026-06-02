import app from './app';
import { config } from './config';
import { db } from './config/database';
import { redis } from './config/redis';
import { logger } from './utils/logger';

async function start() {
    try {
        // Test DB connection
        await db.raw('SELECT 1');
        logger.info('MySQL connected');

        // Redis connects automatically
        logger.info('Redis ready');

        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });

    } catch (err) {
        logger.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();