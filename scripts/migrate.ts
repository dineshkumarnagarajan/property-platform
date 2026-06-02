import { db } from '../src/config/database';
import fs from 'fs';
import path from 'path';
import { logger } from '../src/utils/logger';

async function migrate() {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
        if (!file.endsWith('.sql')) continue;
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            try {
                await db.raw(statement);
            } catch (err: any) {
                if (
                    err.code === 'ER_DUP_KEYNAME' ||
                    err.code === 'ER_TABLE_EXISTS_ERROR'
                ) {
                    logger.info(`Skipped (already exists): ${statement.trim().split('\n')[0]}`);
                } else {
                    throw err;
                }
            }
        }
        logger.info(`Migrated: ${file}`);
    }

    await db.destroy();
    logger.info('All migrations done');
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});