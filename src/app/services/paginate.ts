import { Request, Response } from 'express';
import { Model, Query } from 'mongoose';
import IPagination from '../../interfaces/Pagination';
import { API_RESPONSE_PAGE_SIZE } from '../helpers/constants';

class PaginationService {
	public static async paginate(
		req: Request,
		res: Response,
		query: Query<Model<any>[], any, {}, any>,
		responseMessage?: string
	) {
		// Pagination
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit =
			parseInt(req.query.limit as string, 10) || API_RESPONSE_PAGE_SIZE;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		query = query.skip(startIndex).limit(limit);

		// Execute query
		const results = await query;

		const total = await query.countDocuments();

		// Pagination result
		const pagination: IPagination = { current: page, limit, total };

		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
				total,
			};
		}

		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
				total,
			};
		}

		return res.status(200).json({
			success: true,
			message: responseMessage || 'records retrieved',
			data: results,
			count: results.length,
			pagination,
		});
	}
}

export default PaginationService;
