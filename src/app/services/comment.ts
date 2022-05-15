import { Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import Comment from '../models/Comment';

class CommentService {
	public static async getComments(res: Response) {
		return await res.advancedResults(Comment, [
			{ path: 'user', select: 'fullName avatar faculty department level' },
		]);
	}

	public static async getComment(commentId: Types.ObjectId) {
		const comment = await Comment.findById(commentId).populate(
			'user',
			'fullName avatar faculty department level'
		);

		if (!comment) {
			throw new NotFoundError('comment not found');
		}

		return comment;
	}

	public static async replyToComment(
		userId: Types.ObjectId,
		commentId: Types.ObjectId,
		text: string
	) {
		const parentComment = await this.getComment(commentId);

		const comment = await Comment.create({
			parentComment: parentComment._id,
			user: userId,
			text,
		});

		return comment;
	}
}

export default CommentService;
