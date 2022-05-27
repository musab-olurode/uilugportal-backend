import { Schema, model, Types } from 'mongoose';
import { PostDoc } from '../../interfaces/PostDoc';

const PostSchema = new Schema(
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
				(val: string[]) => val.length <= 5,
				'{PATH} exceeds the limit of 5',
			],
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

PostSchema.index({ '$**': 'text' });

export default model<PostDoc>('Post', PostSchema);
