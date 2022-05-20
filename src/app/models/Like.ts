import { Schema, model, Types } from 'mongoose';
import { LikeDoc } from '../../interfaces/LikeDoc';

const LikeSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		post: {
			type: Types.ObjectId,
			ref: 'Post',
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<LikeDoc>('Like', LikeSchema);
