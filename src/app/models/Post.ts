import { Schema, model, Types } from 'mongoose';
import { PostDoc } from '../../interfaces/PostDoc';

const PostSchema = new Schema<PostDoc>(
	{
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		images: {
			type: [String],
			validate: [
				(val: string[]) => val.length <= 2,
				'{PATH} exceeds the limit of 2',
			],
		},
		comments: [
			{
				type: Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{ timestamps: true }
);

export default model<PostDoc>('Post', PostSchema);
