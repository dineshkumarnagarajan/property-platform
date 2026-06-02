import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';
import { crmQueue } from '../queues/crm.queue';
import { webhookRepository } from '../repositories/webhook.repository';

const router = Router();

router.post('/crm', async (req: Request, res: Response) => {
    const signature = (req.headers['x-hub-signature'] as string)?.toLowerCase();
    const payload = JSON.stringify(req.body);

    if (!signature || !crmService.verifyWebhookSignature(payload, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const idempotency = req.headers['x-idempotency-key'] as string;
    const existing = await webhookRepository.findByIdempotencyKey(idempotency);
    if (existing) {
        return res.status(200).json({ message: 'Already processed' });
    }

    const event = await webhookRepository.create('crm', idempotency, req.body);
    await crmQueue.add('webhook', req.body);

    res.status(202).json({ id: event.id, message: 'Webhook received' });
});

export default router;