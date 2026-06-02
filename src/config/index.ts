import dotenv from 'dotenv';
dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'propertyplatform',
        user: process.env.DB_USER || 'pp_user',
        password: process.env.DB_PASSWORD || 'pp_password',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'fallback_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    crm: {
        webhookSecret: process.env.CRM_WEBHOOK_SECRET || '',
    },

    wp: {
        graphqlUrl: process.env.WP_GRAPHQL_URL || '',
    },

    cache: {
        ttlEnquiry: parseInt(process.env.CACHE_TTL_ENQUIRY || '60', 10),
        ttlWpProperties: parseInt(process.env.CACHE_TTL_WP_PROPERTIES || '300', 10),
    },
};