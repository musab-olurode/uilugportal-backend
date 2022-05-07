import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import { UserDoc } from '../../interfaces/UserDoc';
import { uploadFile } from '../helpers/upload';
import Comment from '../models/Comment';

class CommentService {
	public static async getComments(res: Response) {
		return await res.advancedResults(Comment, 'user');
	}

	public static async getComment(commentId: Types.ObjectId) {
		const comment = await Comment.findById(commentId).populate('user');

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
