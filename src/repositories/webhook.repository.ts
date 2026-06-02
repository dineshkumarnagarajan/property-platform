import { db } from '../config/database';
import { generateUUID } from '../utils/hash';

export interface WebhookEvent {
    id: string;
    source: string;
    idempotency_key: string;
    payload: object;
    processed: boolean;
    created_at: Date;
}

export const webhookRepository = {

    create: async (
        source: string,
        idempotency_key: string,
        payload: object
    ): Promise<WebhookEvent> => {
        const id = generateUUID();
        await db('webhook_events').insert({
            id,
            source,
            idempotency_key,
            payload: JSON.stringify(payload),
            processed: false,
        });
        const row = await db('webhook_events').where({ id }).first();
        return row;
    },

    findByIdempotencyKey: async (key: string): Promise<WebhookEvent | null> => {
        const row = await db('webhook_events').where({ idempotency_key: key }).first();
        return row || null;
    },

    markProcessed: async (id: string): Promise<void> => {
        await db('webhook_events').where({ id }).update({ processed: true });
    },
};