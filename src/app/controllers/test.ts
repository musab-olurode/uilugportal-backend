import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import ScrapperService from '../services/scrapper';

// eslint-disable-next-line no-unused-vars
export const testFunction = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		const values = ScrapperService.test();

		return new SuccessResponse('scrapped successfully', { values }).send(res);
	}
);
