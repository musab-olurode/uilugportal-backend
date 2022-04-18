import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import ScrapperService from '../services/scrapper';

export const testFunction = asyncHandler(
	async (req: Request, res: Response) => {
		const values = ScrapperService.test();

		return new SuccessResponse('scrapped successfully', { values }).send(res);
	}
);
