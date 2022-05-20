import { Schema, model, Types } from 'mongoose';
import { CommentDoc } from '../../interfaces/CommentDoc';

const CommentSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		post: {
			type: Types.ObjectId,
			ref: 'Post',
			required: function (): boolean {
				return !(this as unknown as CommentDoc)!.parentComment;
			},
		},
		parentComment: {
			type: Types.ObjectId,
			ref: 'Comment',
			required: function (): boolean {
				return !(this as unknown as CommentDoc)!.post;
			},
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<CommentDoc>('Comment', CommentSchema);
