import { Router, Request, Response } from 'express';
import { enquiryService } from '../services/enquiry.service';
import { validate } from '../middleware/validate.middleware';
import { createEnquirySchema } from '../validators/enquiry.schema';
import { enquiryLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post(
    '/',
    enquiryLimiter,
    validate(createEnquirySchema),
    async (req: Request, res: Response) => {
        try {
            const enquiry = await enquiryService.create(req.body, req.ip!);
            res.status(201).json(enquiry);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const enquiry = await enquiryService.getById(req.params.id);
        if (!enquiry) return res.status(404).json({ error: 'Not found' });
        res.json(enquiry);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const result = await enquiryService.listAll(page, limit, status);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;