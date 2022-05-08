import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async';
import NewsService from '../services/news';

export const getNews = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		source: 'string|in:unilorinsu,teamplato',
		page: 'numeric|min:1',
	});

	return await NewsService.getNews(req, res);
});
