import knex from 'knex';
import { config } from './index';

export const db = knex({
    client: 'mysql2',
    connection: {
        host: config.db.host,
        port: config.db.port,
        database: config.db.name,
        user: config.db.user,
        password: config.db.password,
    },
    pool: {
        min: 2,
        max: 10,
    },
    acquireConnectionTimeout: 10000,
});