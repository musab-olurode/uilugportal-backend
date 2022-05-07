import { Request, Response } from 'express';
import asyncHandler from '../middlewares/async';
import CommentService from '../services/comment';
import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';

export const index = asyncHandler(async (req: Request, res: Response) => {
	return await CommentService.getComments(res);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
	const comment = await CommentService.getComment(
		req.params.commentId as unknown as Types.ObjectId
	);

	return new SuccessResponse('comment retrieved successfully', {
		comment,
	}).send(res);
});

export const replyToComment = asyncHandler(
	async (req: Request, res: Response) => {
		await req.validate({
			text: 'required|string',
		});

		const { text } = req.validated();

		const comment = await CommentService.replyToComment(
			req.user!._id,
			req.params.commentId as unknown as Types.ObjectId,
			text
		);

		return new SuccessResponse('comment replied successfully', {
			comment,
		}).send(res);
	}
);
