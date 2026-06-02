import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config';
import enquiryRoutes from './routes/enquiry.routes';
import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import propertiesRoutes from './routes/properties.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '512kb' }));
app.use(compression());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/enquiry', enquiryRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/properties', propertiesRoutes);

app.use(errorHandler);

export default app;