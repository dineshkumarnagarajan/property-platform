import { z } from 'zod';

export const createEnquirySchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(255),
    email: z
        .string()
        .email('Invalid email address')
        .max(255),
    phone: z
        .string()
        .regex(/^[+\d\s\-()]{7,20}$/, 'Invalid phone number')
        .optional(),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(5000),
    property_id: z
        .string()
        .max(100)
        .optional(),
});

export const listEnquirySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['pending', 'contacted', 'closed']).optional(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;