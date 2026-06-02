import { Router, Request, Response } from 'express';
import { wordpressService } from '../services/wordpress.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const properties = await wordpressService.getProperties(page);
        res.json(properties);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;