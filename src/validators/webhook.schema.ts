import { z } from 'zod';

export const crmWebhookSchema = z.object({
    event: z.string().min(1),
    enquiry_id: z.string().uuid('Invalid enquiry ID'),
    crm_id: z.string().optional(),
    status: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});

export type CrmWebhookInput = z.infer<typeof crmWebhookSchema>;