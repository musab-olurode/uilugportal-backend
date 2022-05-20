import { Request, Response } from 'express';
import { Query, Document, Aggregate, PipelineStage, Model } from 'mongoose';
import IPagination from '../../interfaces/Pagination';
import { API_RESPONSE_PAGE_SIZE } from '../helpers/constants';

class PaginationService {
	public static async paginate(
		req: Request,
		res: Response,
		query: Query<Document<any>[], any, {}, any>,
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

	public static async paginateAggregate(
		req: Request,
		res: Response,
		model: Model<any>,
		pipelines: PipelineStage[],
		responseMessage?: string
	) {
		// Pagination
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit =
			parseInt(req.query.limit as string, 10) || API_RESPONSE_PAGE_SIZE;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		pipelines = [
			...pipelines,
			{ $skip: startIndex },
			{ $limit: limit },
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					records: { $push: '$$ROOT' },
				},
			},
		];

		const result = await model.aggregate(pipelines);

		const total = result.length == 1 ? result[0].total : 0;
		const records = result.length == 1 ? result[0].records : [];

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
			data: records,
			count: records.length,
			pagination,
		});
	}
}

export default PaginationService;
