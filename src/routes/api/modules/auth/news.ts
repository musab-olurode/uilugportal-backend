import express, { Request, Response } from 'express';
import { getNews } from '../../../../app/controllers/news';
import apicache from 'apicache';

// caching
const cache = apicache.middleware;
const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200;

const router = express.Router();

router.get('/', cache('5 minutes', onlyStatus200), getNews);

export default router;
