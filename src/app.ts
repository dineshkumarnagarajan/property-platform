import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.env === 'production' ? 'https://yourdomain.com' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request parsing
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        env: config.env,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

export default app;